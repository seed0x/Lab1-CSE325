# Lab 1: Vitest Setup from Scratch
**Week 1 | Testing I**

## Overview

In this lab, you'll set up a complete testing environment from scratch using [Vitest](https://vitest.dev/), a modern JavaScript/TypeScript testing framework. By the end of this lab, you'll understand the anatomy of a test, configure a real testing environment, and write your first unit and integration tests.

**Time Estimate:** 90-120 minutes

**Prerequisites:** [Node.js](https://nodejs.org/en/download/current) 20+ installed, [VS Code](https://code.visualstudio.com/download), basic TypeScript familiarity

> [!IMPORTANT]
> **Windows Users:** This lab uses terminal commands written for Unix-based systems (macOS/Linux). If you're on Windows, use [PowerShell](https://microsoft.com/powershell) (not Command Prompt) for the best compatibility. Most commands will work identically. Where commands differ, both versions are provided.

## Learning Objectives

After completing this lab, you will be able to:

1. Initialize a Node.js project with TypeScript support
2. Install and configure Vitest as your testing framework
3. Write tests that follow the Arrange-Act-Assert pattern
4. Distinguish between unit tests and integration tests in practice
5. Run tests and interpret coverage reports

## Connection to Readings

This lab directly applies concepts from your Week 1 readings:

- **"But really, what is a JavaScript test?"** — You'll see that tests are just code that throws errors when something goes wrong
- **"Write tests. Not too many. Mostly integration."** — You'll write both unit and integration tests and see the difference in confidence they provide
- **The Testing Trophy** — You'll set up static analysis (TypeScript) alongside your test framework

---

## Part 1: Project Setup (20 minutes)

### Step 1.1: Create the Project Directory

Open your terminal and create a new project:

```bash
mkdir vitest-lab
cd vitest-lab
```

### Step 1.2: Initialize the Node.js Project

```bash
npm init -y
```

This creates a `package.json` file. Open it and update it to enable ES modules:

```json
{
  "name": "vitest-lab",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

### Step 1.3: Install Dependencies

Install TypeScript, Vitest, and related tooling:

```bash
npm install -D typescript vitest @vitest/coverage-v8
```

### Step 1.4: Configure TypeScript

Create a `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "types": ["vitest/globals"]
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 1.5: Configure Vitest

Create a `vitest.config.ts` file in your project root:

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'vitest.config.ts']
    }
  }
});
```

### Step 1.6: Create the Source Directory Structure

```bash
# Linux/macOS/PowerShell:
mkdir -p src/utils
mkdir -p src/services

# Windows Command Prompt:
mkdir src\utils
mkdir src\services
```

Your project structure should now look like this:

```
vitest-lab/
├── node_modules/
├── src/
│   ├── utils/
│   └── services/
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

**✅ Checkpoint:** Run `npm test` — it should start Vitest in watch mode (press `q` to quit). You'll see "No test files found" which is expected.

---

## Part 2: Your First Test — Understanding the Anatomy (25 minutes)

### The Simplest Possible Test

Before using any framework, let's understand what Kent C. Dodds means when he says _"a test is code that throws an error when the actual result does not match the expected output."_

### Step 2.1: Create a Simple Function

Create `src/utils/math.ts`:

```typescript
export function add(a: number, b: number): number {
  return a + b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error('Cannot divide by zero');
  }
  return a / b;
}
```

### Step 2.2: Write Your First Test File

Create `src/utils/math.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { add, multiply, divide } from './math';

describe('math utilities', () => {
  describe('add', () => {
    it('adds two positive numbers', () => {
      // Arrange
      const a = 2;
      const b = 3;

      // Act
      const result = add(a, b);

      // Assert
      expect(result).toBe(5);
    });

    it('adds negative numbers', () => {
      expect(add(-1, -1)).toBe(-2);
    });

    it('adds zero', () => {
      expect(add(5, 0)).toBe(5);
    });
  });

  describe('multiply', () => {
    it('multiplies two numbers', () => {
      expect(multiply(3, 4)).toBe(12);
    });

    it('returns zero when multiplied by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });

  describe('divide', () => {
    it('divides two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('throws an error when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow('Cannot divide by zero');
    });
  });
});
```

### Step 2.3: Run the Tests

```bash
npm test
```

You should see all tests passing. Notice the structure:

- `describe()` groups related tests
- `it()` defines individual test cases
- `expect()` makes assertions

**🤔 Reflection Question:** Look at the `add` tests. The first test uses explicit Arrange-Act-Assert comments. Why might this pattern be useful, especially for complex tests?

### Step 2.4: See a Test Fail

Temporarily break the `add` function to see what a failing test looks like:

```typescript
export function add(a: number, b: number): number {
  return a - b; // Bug introduced!
}
```

Run the tests again and observe:
- Which tests fail?
- What information does Vitest provide about the failure?
- How does this relate to "code that throws an error when actual doesn't match expected"?

**Restore the correct implementation before continuing.**

---

## Part 3: Testing Real-World Logic (30 minutes)

Now let's write tests for more realistic functionality.

### Step 3.1: Create a String Utilities Module

Create `src/utils/strings.ts`:

```typescript
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - suffix.length) + suffix;
}

export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function countWords(text: string): number {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}
```

### Step 3.2: Write Comprehensive Tests

Create `src/utils/strings.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { slugify, truncate, capitalize, countWords } from './strings';

describe('string utilities', () => {
  describe('slugify', () => {
    it('converts a simple string to a slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('handles multiple spaces', () => {
      expect(slugify('Hello    World')).toBe('hello-world');
    });

    it('removes special characters', () => {
      expect(slugify('Hello, World!')).toBe('hello-world');
    });

    it('handles leading and trailing spaces', () => {
      expect(slugify('  Hello World  ')).toBe('hello-world');
    });

    it('handles already lowercase strings', () => {
      expect(slugify('hello world')).toBe('hello-world');
    });

    // TODO: Add your own test case
  });

  describe('truncate', () => {
    it('returns the original string if shorter than maxLength', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('truncates and adds default suffix', () => {
      expect(truncate('Hello World', 8)).toBe('Hello...');
    });

    it('uses custom suffix', () => {
      expect(truncate('Hello World', 9, '…')).toBe('Hello Wo…');
    });

    it('handles exact length strings', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });

    // TODO: Add your own test case
  });

  describe('capitalize', () => {
    it('capitalizes a lowercase word', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('handles already capitalized words', () => {
      expect(capitalize('HELLO')).toBe('Hello');
    });

    it('returns empty string for empty input', () => {
      expect(capitalize('')).toBe('');
    });

    // TODO: Add your own test case
  });

  describe('countWords', () => {
    it('counts words in a simple sentence', () => {
      expect(countWords('Hello world')).toBe(2);
    });

    it('handles multiple spaces between words', () => {
      expect(countWords('Hello    world')).toBe(2);
    });

    it('returns zero for empty string', () => {
      expect(countWords('')).toBe(0);
    });

    it('returns zero for whitespace-only string', () => {
      expect(countWords('   ')).toBe(0);
    });

    // TODO: Add your own test case
  });
});
```

### Step 3.3: Run Tests with Coverage

```bash
npm run test:coverage
```

Examine the coverage report. You should see high coverage for the functions you've tested.

---

## Part 4: Integration Test — Multiple Units Working Together (25 minutes)

Now let's see the difference between unit tests and integration tests, connecting to the Testing Trophy concept.

### Step 4.1: Create a Content Service

Create `src/services/content.ts`:

```typescript
import { slugify, truncate, capitalize } from '../utils/strings';

export interface Article {
  title: string;
  body: string;
  author: string;
}

export interface ProcessedArticle {
  title: string;
  slug: string;
  excerpt: string;
  author: string;
}

export function processArticle(article: Article, excerptLength = 100): ProcessedArticle {
  return {
    title: capitalize(article.title),
    slug: slugify(article.title),
    excerpt: truncate(article.body, excerptLength),
    author: capitalize(article.author)
  };
}

export function processArticles(articles: Article[], excerptLength = 100): ProcessedArticle[] {
  return articles.map(article => processArticle(article, excerptLength));
}

export function findArticleBySlug(
  articles: ProcessedArticle[],
  slug: string
): ProcessedArticle | undefined {
  return articles.find(article => article.slug === slug);
}
```

### Step 4.2: Write Integration Tests

Create `src/services/content.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { processArticle, processArticles, findArticleBySlug, Article } from './content';

describe('content service', () => {
  // Sample test data
  const sampleArticle: Article = {
    title: 'hello world: my first post',
    body: 'This is the body of my first blog post. It contains multiple sentences and should be truncated in the excerpt.',
    author: 'jane doe'
  };

  describe('processArticle', () => {
    it('processes an article with all transformations', () => {
      const result = processArticle(sampleArticle, 50);

      // This is an INTEGRATION test - it tests multiple units working together
      expect(result.title).toBe('Hello world: my first post');
      expect(result.slug).toBe('hello-world-my-first-post');
      expect(result.excerpt).toBe('This is the body of my first blog post. It co...');
      expect(result.author).toBe('Jane doe');
    });

    it('uses default excerpt length when not specified', () => {
      const result = processArticle(sampleArticle);

      expect(result.excerpt.length).toBeLessThanOrEqual(100);
    });
  });

  describe('processArticles', () => {
    it('processes multiple articles', () => {
      const articles: Article[] = [
        sampleArticle,
        {
          title: 'SECOND POST',
          body: 'Another post body here.',
          author: 'JOHN SMITH'
        }
      ];

      const results = processArticles(articles, 50);

      expect(results).toHaveLength(2);
      expect(results[0].slug).toBe('hello-world-my-first-post');
      expect(results[1].slug).toBe('second-post');
      expect(results[1].author).toBe('John smith');
    });

    it('returns empty array for empty input', () => {
      expect(processArticles([])).toEqual([]);
    });
  });

  describe('findArticleBySlug', () => {
    it('finds an article by its slug', () => {
      const processed = processArticles([
        sampleArticle,
        { title: 'Another Post', body: 'Body', author: 'Author' }
      ]);

      const found = findArticleBySlug(processed, 'hello-world-my-first-post');

      expect(found).toBeDefined();
      expect(found?.title).toBe('Hello world: my first post');
    });

    it('returns undefined when slug not found', () => {
      const processed = processArticles([sampleArticle]);

      const found = findArticleBySlug(processed, 'non-existent-slug');

      expect(found).toBeUndefined();
    });
  });
});
```

### Step 4.3: Understand the Difference

**🤔 Reflection Questions:**

1. The `strings.test.ts` file contains **unit tests** — they test individual functions in isolation. The `content.test.ts` file contains **integration tests** — they test how multiple units work together.

2. If the `slugify` function had a bug, which tests would fail? (Answer: Both the unit tests in `strings.test.ts` AND the integration tests in `content.test.ts`)

3. What additional confidence do the integration tests give you that unit tests alone wouldn't provide?

---

## Part 5: Deliverables

### Required Files

Submit your completed project as a GitHub repository containing:

```
vitest-lab/
├── src/
│   ├── utils/
│   │   ├── math.ts
│   │   ├── math.test.ts
│   │   ├── strings.ts
│   │   └── strings.test.ts
│   └── services/
│       ├── content.ts
│       └── content.test.ts
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

### README.md Requirements

Your README should include:

1. **Setup Instructions** — How to install and run the tests
2. **Reflection Answers** — Your answers to the reflection questions throughout the lab
3. **Additional Tests** — List the test cases you added (marked with TODO in the lab)
4. **Testing Trophy Connection** — A brief paragraph (3-5 sentences) explaining how this lab connects to the Testing Trophy concept from your readings

### Test Requirements

Your submission must:

- Have all provided tests passing
- Include at least **4 additional test cases** you wrote yourself (one per TODO)
- Achieve at least **90% code coverage** on the utility functions

---

## Grading Rubric

| Criteria | Points |
|----------|--------|
| Project setup correct (all config files present and valid) | 15 |
| All provided tests pass | 20 |
| 4+ additional test cases written | 20 |
| Code coverage ≥ 90% on utility functions | 15 |
| README complete with reflection answers | 20 |
| Code quality (clean, well-organized) | 10 |
| **Total** | **100** |

---

## Stretch Goals (Optional)

If you finish early, try these extensions:

1. **Add ESLint** — Set up ESLint with TypeScript support. This adds the "Static" layer of the Testing Trophy.

2. **Async Testing** — Create a function that simulates an async API call and write tests using `async/await`:

   ```typescript
   export async function fetchArticle(id: string): Promise<Article> {
     // Simulate network delay
     await new Promise(resolve => setTimeout(resolve, 100));
     return { title: 'Fetched Article', body: 'Content', author: 'API' };
   }
   ```

3. **Parameterized Tests** — Use Vitest's `it.each` to write parameterized tests:

   ```typescript
   it.each([
     ['Hello World', 'hello-world'],
     ['foo bar baz', 'foo-bar-baz'],
     ['Test 123', 'test-123'],
   ])('slugify("%s") returns "%s"', (input, expected) => {
     expect(slugify(input)).toBe(expected);
   });
   ```

---

## Troubleshooting

**"Cannot find module" errors:**
- Ensure you have `"type": "module"` in your `package.json`
- Check that file extensions are correct (`.ts` for TypeScript files)

**Coverage not generating:**
- Run `npm run test:coverage` (not just `npm test`)
- Ensure `@vitest/coverage-v8` is installed

**TypeScript errors:**
- Make sure `tsconfig.json` includes `"types": ["vitest/globals"]`
- Run `npx tsc --noEmit` to check for TypeScript errors

---

## Submission

Push your completed project to GitHub and submit the repository URL through Canvas by the due date.

**Due:** End of Week 1 (see Canvas for exact date/time)

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

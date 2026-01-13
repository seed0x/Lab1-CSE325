# Vitest Lab 1 — Testing Setup from Scratch 

This project sets up a complete testing environment from scratch using Vitest and TypeScript. The goal of this lab was to understand how tests are structured, how to write unit vs integration tests, and how testing fits into the Testing Trophy concept.

--- 

## Setup Instructions 

### Prerequisites 

- Node.js v20+ 

- npm 

- VS Code (recommended) 


### Install dependencies 

```
npm install 
```
### Run tests
```
npm test 
```
### Run tests with coverage
```
npm run test:coverage
```

### File structure
```
cse325-lab1-vitest-setup-seed0x/
├── .github/
│   └── workflows/
│       └── test.yml            
├── .gitignore                  
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
├── package-lock.json
├── tsconfig.json
├── vitest.config.ts
└── README.md                  
```
---

### Additional Tests Added 

To meet the lab requirement, I added one additional test per utility section: 


#### slugify 
```
  it('handles leading and trailing hyphens', () => {
    expect(slugify('-hello world-')).toBe('hello-world');
```
#### truncate 
```
    it('handles empty string', () => {
      expect(truncate('', 5)).toBe('');
```
#### capitalize 
```
   it('returns character if special charcter used', () => {
      expect(capitalize('-Hello')).toBe('-hello');
```
#### countWords 
```
    it('counts numbers as a word', () => {
      expect(countWords('Hi this is a 34 test')).toBe(6);
```
---

### Reflection Answers 

#### Why is the Arrange–Act–Assert pattern useful? 

The Arrange–Act–Assert pattern helps a lot with readability, especially when tests start getting more complex. I like that it clearly separates setup, execution, and checking the result, because it makes it easier to understand what the test is doing at a glance. It also helps when coming back later or trying to figure out where a failure is happening.

#### Which file contains unit tests and which contains integration tests? How can you tell the difference?  

The strings.test.ts file contains unit tests because each tests one function at a time and checks behavior in isolation. The content.test.ts file contains integration tests because it tests how multiple utility functions work together when processing articles.

#### If the slugify function had a bug, which test files would have failing tests? Why does this happen? 

Both strings.test.ts and content.test.ts would have failing tests. The unit tests would fail because they directly test slugify, and the integration tests would fail because slugify is used as part of the article processing logic

#### What additional confidence do the integration tests give you that unit tests alone wouldn’t provide? 

Integration tests give confidence that the different parts of the code base actually work together, not just individually. Even if each function passes its own unit tests, integration tests help catch issues or bugs that only show up when the functions are used together. 

#### Testing Trophy Connection 

This lab connects to the Testing Trophy by using different types of testing together. TypeScript helps catch basic type mistakes early, before the code even runs. Unit tests check that individual functions work on their own, while integration tests make sure those functions work correctly when used together.

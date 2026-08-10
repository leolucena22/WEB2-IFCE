# Revisão Completa de JavaScript (Node.js)

## 1. Boas Práticas Gerais

### 1.1 Variáveis e Escopo
```javascript
// ❌ Criar variáveis globais no escopo global
let globalVar = "bad";

// ✅ Usar const/let em vez de var
const CONSTANT = "good";
let instance = {};

// ✅ Preferir const para referências imutáveis
const array = [1, 2, 3];
array.push(4); // OK - const permite mutação do array
array = [5];   // Erro - não pode reassign
```

### 1.2 ECMAScript 2020+
```javascript
// ✅ Optional Chaining
const name = user?.profile?.name;

// ✅ Nullish Coalescing
const value = url || "default";
const isEmpty = value ?? "";

// ✅ Logical Assignment
let hasError = false;
if (!response.ok) hasError = true;

// ✅ Universal String Methods (padStart/padEnd)
const padded = "5".padStart(2, "0"); // "05"

// ✅ Non-Optional Chaining com Promise
const result = await fetch(url).then(r => r.text()).catch(() => "fallback");
```

## 2. Estruturas de Controle

### 2.1 For Loops
```javascript
// ✅ Loop com cláusula de parada
for (let i = 0; i < array.length; i++) {
  console.log(array[i]);
}

// ✅ For...of (melhor para iterar arrays)
for (const item of array) {
  console.log(item);
}

// ✅ For...in (apenas para objetos, nunca use para arrays)
// Evite: for (const key in obj) se você quer iteração sobre arrays

// ✅ Evitar while sem condição de parada
let i = 0;
while (i < 10) { // SEMPRE deve ter condição de parada
  i++;
}
```

### 2.2 Switch Statements
```javascript
// ✅ Usar switches com break ou return
function getStatus(code) {
  switch (code) {
    case 200:
      return "OK";
    case 404:
      return "Not Found";
    default:
      return "Unknown";
  }
}

// ❌ Omitir break sem justificativa (código não-intencional)
```

### 2.3 Ternary Operator
```javascript
// ✅ Usar ternário com cláusulas curtas
const status = (user && user.active) ? "Active" : "Inactive";

// ❌ Evitar navegação profunda
// ❌ if (a && b) ? c : d : e (muito difícil de ler)
```

## 3. Funções

### 3.1 Funções Declarações vs Arrow Functions
```javascript
// ✅ Funções anônimas (arrow)
const multiply = (a, b) => a * b;

// ✅ Funções declarativas
function add(a, b) { return a + b; }

// ✅ Arrow com body simples
const greet = name => `Hello, ${name}`;

// ❌ Arrow com body complexo (objeto literal ou blocos)
const getObj = (id) => {
  const item = { id };
  return item;
};
```

### 3.2 Higher-Order Functions
```javascript
// ✅ Funções de callback apropriadas
const results = data.filter(item => item.active)
                    .map(item => item.name)
                    .sort((a, b) => a.localeCompare(b));

// ✅ Currying
const multiply = a => b => a * b;
const double = multiply(2); // Resultado: b => 2 * b

// ✅ Partial application
const addFive = add(5);
console.log(addFive(3)); // 8
```

## 4. Manejo de Erros

### 4.1 try...catch...finally
```javascript
// ✅ Try-catch com finally
try {
  const result = await fetchData();
  return result;
} catch (error) {
  console.error("Erro:", error.message);
  throw error;
} finally {
  // Sempre executa (limpar recursos, fechar conexão, etc)
  cleanup();
}

// ✅ Try-catch-aninhadas (cuidado com stack traces longas)
try {
  try {
    await riskyOperation();
  } catch (innerError) {
    console.error("Erro interno:", innerError);
  }
} catch (outerError) {
  console.error("Erro externo:", outerError);
}

// ❌ try-catch sem controle (sem catch é uma "floating error")
// ❌ throw sem mensagem clara
throw new Error("Descrição do erro explícita");
```

### 4.2 Error Classes
```javascript
// ✅ Criar classes de erro customizadas
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// ✅ Módulos de erro (para erros específicos)
// errors/validationError.js
export class ValidationError extends Error {
  constructor(field) {
    super(`Validação falhou no campo: ${field}`);
    this.statusCode = 400;
  }
}

// ✅ Usando Error.create (se disponível)
// ou manualmente
const err = Object.assign(new Error(), { name: "CustomError" });
```

### 4.3 Error Handling Patterns
```javascript
// ✅ Error handling com async/await
const handleUserRequest = async (req, res) => {
  try {
    const user = await getUser(req.params.id);
    if (!user) throw new NotFoundError();
    res.json(user);
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
};

// ✅ Validation com validadores (Zod, Joi, etc)
const schema = z.object({
  name: z.string().min(1),
  email: z.string().email()
});

// ✅ Timeout com AbortController
const controller = new AbortController();
const timeout = setTimeout(() => controller.abort(), 5000);

try {
  const response = await fetch(url, { signal: controller.signal });
} catch (err) {
  if (err.name === "AbortError") {
    console.error("Request timed out");
  }
} finally {
  clearTimeout(timeout);
}
```

## 5. Asynchronous Patterns

### 5.1 async/await
```javascript
// ✅ async/await com try-catch
const processData = async () => {
  try {
    const data = await fetchData();
    const processed = await process(data);
    return processed;
  } catch (error) {
    console.error("Processing failed:", error);
    throw error;
  }
};

// ✅ Parallel execution
const [users, posts] = await Promise.all([
  fetchUsers(),
  fetchPosts()
]);

// ✅ Sequential execution (nunca use for, use await)
const results = [];
for (const item of [1, 2, 3]) {
  results.push(await processItem(item));
}

// ❌ await sem await em uma linha (não é problema, apenas confusão)
// ✅ await em linha é OK (não precisa de separador)
```

### 5.2 Promise Patterns
```javascript
// ✅ Promise.all vs Promise.allSettled
const results = await Promise.allSettled(promiseArray);
const successes = results.filter(r => r.status === "fulfilled").map(r => r.value);
const failures = results.filter(r => r.status === "rejected").map(r => r.reason);

// ✅ Promise.all vs Promise.any
// Promise.all: falha se qualquer um falhar
// Promise.any: sucesso se qualquer um suceder

// ✅ Catching all promises
const safePromises = promises.map(p => {
  return p.catch(err => ({ error: err.message, ok: false }));
});
const results = await Promise.all(safePromises);
```

### 5.3 Throttle e Debounce
```javascript
// Throttle
const throttle = (fn, limit) => {
  let lastCall = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      fn(...args);
    }
  };
};

// Debounce
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
};

// ✅ Debounce para input (evita chamadas repetitivas)
const searchInput = document.getElementById("search");
searchInput.addEventListener("input", debounce((e) => {
  fetchSearch(e.target.value);
}, 300));
```

## 6. Manipulação de Arrays e Objetos

### 6.1 Array Methods
```javascript
// ✅ Array.from para arrays iteráveis
const arrayLike = { 0: "a", 1: "b", length: 2 };
const arr = Array.from(arrayLike); // ["a", "b"]

// ✅ Array.prototype.find
const found = arr.find(item => item.id === 123);

// ✅ Array.prototype.filter
const filtered = arr.filter(item => item.active);

// ✅ Array.prototype.map
const mapped = arr.map(item => item.name.toUpperCase());

// ✅ Array.prototype.reduce
const sum = arr.reduce((acc, item) => acc + item.value, 0);

// ✅ Array.prototype.flatMap
const flattened = arr.flatMap(item => [item.a, item.b]);

// ✅ Array.prototype.flat (para array aninhado)
const flat = arr.flat(2);

// ✅ Array.prototype.slice para criar cópias
const copy = arr.slice();

// ❌ Evitar: Array.splice (muta o array original)
// ❌ Evitar: Array.push (com array modificável)

// ✅ Spread operator para arrays (cria cópia)
const newArr = [...arr, 100];
```

### 6.2 Object Methods
```javascript
// ✅ Object.fromEntries
const obj = { a: 1, b: 2 };
const entries = Object.entries(obj); // [["a", 1], ["b", 2]]

// ✅ Object.fromEntries
const reversed = Object.fromEntries(Object.entries(obj).reverse());

// ✅ Object.keys/Object.values/Object.entries
const keys = Object.keys(obj);
const values = Object.values(obj);

// ✅ Deep cloning
const deepClone = JSON.parse(JSON.stringify(obj));
// ⚠️ Não funciona para Functions, Dates, Sets, Maps

// ✅ Object.assign (shallow copy)
const shallow = Object.assign({}, obj);

// ✅ Spreads para objetos
const newObj = { ...obj };

// ✅ Spreads para objetos aninhados (recursivo)
const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// ❌ Evitar modificar objeto original
// ❌ const newObj = { ...obj, name = "new" } (só funciona com spread)
```

## 7. Strings

### 7.1 Template Literals
```javascript
// ✅ Interpolação de strings
const name = "world";
const greeting = `Hello, ${name}!`;

// ✅ Multi-line templates
const code = `function
  hello() {
    console.log("Hello");
  }`;

// ✅ Interpolação com objetos
const user = { name: "João", age: 30 };
const message = `Nome: ${user.name}, Idade: ${user.age}`;

// ❌ Fórmulas com escape para quebras de linha
// ❌ `Hello\n` em vez de usar template literal
```

### 7.2 String Methods
```javascript
// ✅ Includes
const hasValue = str.includes("hello");

// ✅ Starts with / Ends with
const starts = str.startsWith("Hello");
const ends = str.endsWith(".js");

// ✅ Replace com regex (com flags)
const replaced = str.replace(/foo/gi, "bar");

// ✅ Split com regex
const parts = str.split(/[\s,]+/);

// ✅ Replace com regex (buscar e substituir)
const sanitized = str.replace(/<[^>]+>/g, "");

// ✅ Replace com regexp (global + case insensitive)
const title = str.replace(/javascript|js/g, "JS");

// ✅ Replace com RegExp com backreference
const duplicated = str.replace(/(\w)\1/g, "$1"); // remove duplicatas consecutivas

// ❌ Evitar replace simples para strings sem regex
```

## 8. Manipulação de Arquivos e Sistema

### 8.1 File System (Node.js)
```javascript
// ✅ Usando fs.promises (async/await)
const fs = await import("fs/promises");
const content = await fs.readFile("file.txt", "utf-8");
await fs.writeFile("file.txt", "new content");

// ✅ Usando fs (com callbacks)
const fs = require("fs");
fs.readFile("file.txt", "utf8", (err, data) => {
  if (err) throw err;
  console.log(data);
});

// ✅ Métodos de leitura segura
const stats = await fs.stat("file.txt");
const isFile = stats.isFile();
const isDirectory = stats.isDirectory();

// ✅ Path utilities
const path = require("path");
const fullPath = path.join(__dirname, "data", "file.txt");
const base = path.basename(fullPath);
const ext = path.extname(fullPath);
const dirname = path.dirname(fullPath);

// ✅ Para operações em Windows/Linux
const sep = path.sep;
const delimiter = path.delimiter;

// ✅ Usando path para resolver URLs de arquivos
const resolve = path.resolve(__dirname, "src", "index.js");
```

### 8.2 Trabalhando com JSON
```javascript
// ✅ Read e Write JSON
const fs = await import("fs/promises");
const data = await fs.readFile("data.json", "utf-8");
const json = JSON.parse(data);
await fs.writeFile("data.json", JSON.stringify(json, null, 2));

// ✅ Read JSON com defaults
const defaultData = { items: [] };
const data = JSON.parse(content) ?? defaultData;

// ✅ Write JSON com spaces indentados
await fs.writeFile("output.json", JSON.stringify(data, null, 2));
```

## 9. Módulos (ES Modules)

### 9.1 Import e Export
```javascript
// ✅ Modern ES Modules
import { foo, bar } from "./utils.js";
import * as utils from "./utils.js";
import utils from "./utils.js";

// ✅ Expor de forma estendida
export { myFunction as default };
export { foo, bar };
export * from "./utils";

// ✅ Export individual (recommended)
export function calculate(x, y) { return x + y; }
export const PI = 3.14159;

// ✅ Expor classes
export class MyClass { constructor() {} }

// ✅ Re-export
export { something } from "./other.js";

// ✅ Default import
import myModule from "./module.js";

// ✅ Default re-export
export { default as MyComponent } from "./component.js";
```

### 9.2 Módulos Dinâmicos (import())
```javascript
// ✅ Dynamically importing modules
const module = await import("./module.js");
const result = await module.function();

// ✅ Com Promise.all (para múltiplos imports dinâmicos)
const [module1, module2] = await Promise.all([
  import("./module1.js"),
  import("./module2.js")
]);
```

### 9.3 Node.js Modules
```javascript
// ✅ Node.js common patterns
// index.js (root)
// ├── core.js (utilidades)
// ├── utils.js (suporte)
// └── app.js (ponto de entrada)

// core.js
const log = (msg) => console.log(`[CORE] ${msg}`);
module.exports = { log };

// app.js
import { log } from "./core.js";
log("Application started");
```

## 10. Programação Assíncrona

### 10.1 Callback Patterns
```javascript
// ❌ Callback hell (estrutura aninhada)
const process = (callback) => {
  callback(err, result);
  callback(err, result);
  callback(err, result);
};

// ✅ Promises
const process = async () => {
  const result = await doSomething();
  return result;
};

// ✅ Async/await (muito preferível)
const process = async () => {
  const data = await fetchData();
  const processed = await processData(data);
  return processed;
};

// ✅ Chaining de Promises
const process = () =>
  fetchData()
    .then(data => processData(data))
    .then(result => result);

// ✅ Error handling
const process = () =>
  fetchData()
    .then(data => processData(data))
    .catch(err => {
      console.error(err);
      throw err;
    });

// ✅ Promise.all com timeout
const processWithTimeout = async (promises, timeout = 5000) => {
  const results = await Promise.allSettled(promises);
  const failures = results.filter(r => r.status === "rejected");
  return results;
};

// ✅ Retry pattern
const retry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
```

### 10.2 Event Loop Patterns
```javascript
// ✅ process.nextTick
process.nextTick(() => {
  console.log("nextTick");
});

// ✅ setTimeout (delay de 0)
setTimeout(() => {
  console.log("timeout");
}, 0);

// ✅ Microtasks (Promise)
Promise.resolve().then(() => {
  console.log("promise");
});

// ❌ Evitar misturar await e setTimeout sem cuidado
// ❌ await dentro de setTimeout sem separação
```

## 11. TypeScript (se aplicável)

```javascript
// ✅ Type annotations
let count: number = 0;
const data: string[] = [];
function add(a: number, b: number): number {
  return a + b;
}

// ✅ Interfaces (para objetos)
interface User {
  id: number;
  name: string;
  email: string;
}

// ✅ Type annotations generics
function identity<T>(arg: T): T {
  return arg;
}

// ✅ Types com union e intersection
type UserId = string | number;
type PartialUser = Partial<User>;
type ReadonlyUser = Readonly<User>;

// ✅ Enums
enum UserRole {
  Admin = "admin",
  User = "user",
  Guest = "guest"
}

// ✅ Arrays typed
const users: Array<User> = [];
const numbers: number[] = [];
const maps: Map<string, number> = new Map();

// ✅ Functions with return type
function getValue(): string {
  return "value";
}

// ✅ Optional parameters
function greet(name: string, greeting: string = "Hello"): string {
  return `${greeting}, ${name}!`;
}

// ✅ Optional return type
function findUser(id: number): User | undefined {
  return null;
}

// ✅ Excluding types
function readOnly(arr: (number | string)[]): number[] {
  return [...arr];
}
```

## 12. Performance

### 12.1 Common Performance Pitfalls
```javascript
// ❌ Iterar sobre arrays grandes com filter/map (sem lazy evaluation)
// ✅ Lazy evaluation / generator
const lazy = (arr) => {
  for (const item of arr) {
    yield item;
  }
};

// ✅ Map para lookup rápido (não iteration)
const map = new Map();
map.set("key", value);
const result = map.get("key");

// ✅ Evitar calcular no loop
const values = arr.map(item => item.value); // OK: calcula tudo de uma vez
// Evitar: arr.reduce((acc, item) => { acc.push(item.value); return acc; }, [])

// ✅ Buffer-based I/O (para grandes volumes de dados)
const buffer = Buffer.alloc(1024);

// ✅ Streaming com streams
const readStream = fs.createReadStream("file.txt");
const writeStream = fs.createWriteStream("output.txt");
readStream.pipe(writeStream);

// ✅ Paginação com paginate
const paginate = (array, page, perPage) => {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  return array.slice(start, end);
};

// ✅ Evitar objetos grandes na memória (memória)
// Evitar criar arrays gigantes na memória
// Use generators (yield) para processar dados em lote
```

## 13. Segurança

### 13.1 Security Best Practices
```javascript
// ✅ Sanitização de inputs
const sanitize = (input) => {
  return input.replace(/<\/?[^>]+(>|$)/g, "").trim();
};

// ✅ Input validation com validadores
// Usar Zod, Joi, Joi, ou express-validator
const { z } = require("zod");
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

// ✅ Não usar eval (CSP - Cross-Site Scripting)
// ✅ Usar templates seguros
// Evitar:
// const html = `<div>${userInput}</div>`; // XSS

// ✅ Usar JSON Web Tokens (em vez de armazenar tokens de sessão na localStorage)
// ✅ Usar HTTPS

// ✅ Criptografia com bcrypt (para senhas)
const bcrypt = require("bcrypt");
const hashedPassword = await bcrypt.hash(password, 10);
const isMatch = await bcrypt.compare(password, hashedPassword);

// ✅ Não armazenar dados sensíveis em localStorage
// ✅ Usar variáveis de ambiente para secrets
// ✅ Validar e sanitizar tudo que vem do usuário
```

## 14. Testes

### 14.1 Testing Patterns
```javascript
// ✅ Testes com Jest (framework)
test("descreva o comportamento", () => {
  expect(calcular(2, 3)).toBe(5);
});

// ✅ Mocks para componentes externos
jest.spyOn(httpClient, "get").mockResolvedValue({ data: "ok" });

// ✅ Snapshots
expect(result).toMatchSnapshot({ data: "value" });

// ✅ Matchers
expect(array).toEqual([1, 2, 3]);
expect(string).toBe("test");
expect(object).toHaveProperty("key", "value");
expect(numeric).toBeGreaterThan(0);

// ✅ Mocks com delays
jest.useFakeTimers();
jest.spyOn(Date, "now").mockReturnValue(1000000);

// ✅ Timeout testing
jest.setTimeout(10000);
```

## 15. Debugging e Profiling

### 15.1 Debugging Techniques
```javascript
// ✅ Debugging com console.trace
console.trace("Caminho de execução");

// ✅ Usar debugger (inspecão do navegador)
// debugger; // Comenta no código (para debugging)

// ✅ Profiling com perf.hooks
const start = performance.now();
// ... código
const elapsed = performance.now() - start;
console.log(`Execution time: ${elapsed}ms`);

// ✅ Performance monitoring
// Usar Node.js --prof para análise de performance
node --prof your-app.js
```

## 16. Checklist Rápido

### [ ] 1. Variáveis: use `const` ou `let`
### [ ] 2. Async/await vs callbacks
### [ ] 3. Error handling: try-catch
### [ ] 4. Strings: template literals
### [ ] 5. Arrays: métodos modernos
### [ ] 6. Objetos: spread operator
### [ ] 7. Módulos: import/export
### [ ] 8. Tipagem: TypeScript
### [ ] 9. Segurança: validações
### [ ] 10. Testes: cobertura

---

> **Nota:** Sempre revise código antes de commitar. Mantenha padrões consistentes de código.
> Use ferramentas como ESLint, Prettier, Prettier, Prettier, Prettier, Prettier.
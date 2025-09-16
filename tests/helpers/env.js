//es como un “botón de reinicio” del entorno para cada test, evitando que un cambio en uno afecte a los demás.
const ORIGINAL_ENV = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = { ...ORIGINAL_ENV };
});

afterAll(() => {
  process.env = ORIGINAL_ENV;
});
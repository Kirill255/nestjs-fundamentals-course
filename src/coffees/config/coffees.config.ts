import { registerAs } from '@nestjs/config';

// регестрируем namespace coffees
export default registerAs('coffees', () => ({
  foo: 'bar',
}));

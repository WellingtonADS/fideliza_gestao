import axios from 'axios';

// Teste de integração REAL (opcional) contra a API.
// Por padrão, fica desativado. Habilite definindo RUN_INTEGRATION=1.
// Base URL padrão aponta para o backend em produção (Render), mas pode ser
// sobrescrita via variável de ambiente API_BASE_URL.

const DEFAULT_BASE_URL = 'https://fideliza-backend.onrender.com/api/v1';
const BASE_URL = process.env.API_BASE_URL || DEFAULT_BASE_URL;

const RUN_INTEGRATION = process.env.RUN_INTEGRATION === '1';
const describeMaybe = RUN_INTEGRATION ? describe : describe.skip;

describeMaybe('Integração real (Gestão) — registrar admin, autenticar e consultar empresa', () => {
  jest.setTimeout(120_000);

  const client = axios.create({
    baseURL: BASE_URL,
    headers: { 'X-Test-Id': 'rn-gestao-integration' },
    timeout: 55_000,
  });

  it('registra company-admin, faz login e obtém /companies/me', async () => {
    const ts = Date.now();
    const email = `rn_gestao_it_${ts}@test.com`;
    const password = 'Senha1234';
    const name = 'RN GESTAO IT';
    const company_name = `Empresa IT ${ts}`;

    // 1) Registrar empresa + admin
    const reg = await client.post('/register/company-admin/', {
      company_name,
      admin_user: { email, password, name },
    });
    expect(reg.status).toBeGreaterThanOrEqual(200);
    expect(reg.status).toBeLessThan(300);
    expect(reg.data).toHaveProperty('id');

    // 2) Login (token)
    const form = new URLSearchParams();
    form.append('username', email);
    form.append('password', password);
    const tok = await client.post('/token', form.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 55_000,
    });
    expect(tok.status).toBe(200);
    const token = tok.data.access_token as string;
    expect(token).toBeTruthy();

    // 3) Consultar empresa do admin
    const authed = axios.create({
      baseURL: BASE_URL,
      headers: { Authorization: `Bearer ${token}`, 'X-Test-Id': 'rn-gestao-integration' },
      timeout: 55_000,
    });
    const meCompany = await authed.get('/companies/me');
    expect(meCompany.status).toBe(200);
    expect(meCompany.data).toHaveProperty('id');
    expect(meCompany.data).toHaveProperty('name');
    // Nome deve ser o cadastrado
    expect((meCompany.data.name as string).toLowerCase()).toContain('empresa it');
  });
});

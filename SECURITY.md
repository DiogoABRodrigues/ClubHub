# Segurança e produção

## Antes de cada deploy

- Usar Node.js 22 LTS ou superior.
- Definir `NODE_ENV=production`.
- Gerar segredos JWT diferentes, aleatórios e com pelo menos 32 caracteres.
- Definir apenas origens HTTPS exatas em `ALLOWED_ORIGINS`.
- Manter `.env`, credenciais Firebase, chaves Supabase e keystores fora do Git.
- Executar `npm ci`, `npm audit --omit=dev`, testes e build.
- Usar HTTPS no proxy e limitar o acesso direto à porta da aplicação.
- Fazer backup e testar restauro da base de dados antes de alterações de schema.

## Gestão de segredos

Os segredos devem viver no secret manager da plataforma. Se algum segredo tiver
sido exposto, deve ser revogado e substituído; removê-lo do Git não é suficiente.
Rodar `JWT_REFRESH_SECRET` invalida também as credenciais por dispositivo.

## Comportamento de segurança relevante

- Access tokens expiram em 15 minutos; refresh tokens são rotativos e persistidos
  apenas como hash.
- Tokens móveis são guardados no Keychain/Android Keystore.
- Endpoints administrativos exigem JWT e role autorizada.
- Dados de dispositivos exigem uma credencial assinada própria.
- Uploads aceitam apenas JPEG, PNG e WebP até 5 MB e validam a assinatura binária.
- CORS e Socket.IO usam a mesma allowlist.

## Resposta a incidentes

1. Revogar as credenciais afetadas.
2. Rodar os segredos JWT e chaves de serviços comprometidas.
3. Invalidar sessões e rever logs pelo `X-Request-Id`.
4. Corrigir, testar e só depois restaurar o serviço.
5. Preservar logs e uma linha temporal do incidente.

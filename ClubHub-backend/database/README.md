# Otimização da base de dados

Depois de fazer backup da base de dados de produção, aplicar os índices com:

```bash
npm run db:optimize
```

O comando é idempotente e pode ser executado novamente. Também substitui o
índice único antigo dos jogos, que não distinguia data nem categoria.

Os modelos Sequelize descrevem os mesmos índices para instalações novas, mas
como o servidor não executa `sequelize.sync()`, este comando é necessário nas
bases de dados já existentes.

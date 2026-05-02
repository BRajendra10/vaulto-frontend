import DocsLayout from '../../components/public/DocsLayout'
import { H1, H2, H3, Lead, P, Code, CodeBlock, Callout, DocTable, DocBadge, Divider } from '../../components/public/DocsUI'

export default function DocsSecretsPage() {
  return (
    <DocsLayout>
      <DocBadge color="purple">Core Concepts</DocBadge>
      <H1>Secrets &amp; Environments</H1>
      <Lead>
        Secrets are the core primitive in Vaulto. Each secret is a key-value pair scoped to
        a project and an environment, with full version history and access controls.
      </Lead>

      <H2 id="what-is-a-secret">What is a Secret?</H2>
      <P>
        A secret consists of a <strong style={{ color: '#e8e8f0' }}>key</strong> (always uppercase,
        e.g. <Code>DATABASE_URL</Code>) and a <strong style={{ color: '#e8e8f0' }}>value</strong> (the
        sensitive string you want to protect). Secrets also carry metadata: which environment they belong
        to, when they expire, and their version history.
      </P>

      <Callout type="warning" title="Values are never returned in list responses">
        When you fetch the list of secrets, the API returns only keys and metadata. The actual value
        is only returned when you explicitly call the <Code>reveal</Code> endpoint — and that action
        is always recorded in the audit log.
      </Callout>

      <H2 id="environments">Environments</H2>
      <P>
        Every secret belongs to exactly one environment. Vaulto supports three:
      </P>

      <DocTable
        headers={['Environment', 'Typical use', 'Recommended access']}
        rows={[
          [<Code>development</Code>, 'Local development, test databases, sandbox API keys', 'All team members'],
          [<Code>staging</Code>,     'Pre-production environment, mirrors production setup', 'Developers and above'],
          [<Code>production</Code>,  'Live environment, real credentials, production databases', 'Admins only (recommended)'],
        ]}
      />

      <P>
        The same key can exist in multiple environments with different values. For example,
        <Code>DATABASE_URL</Code> in <Code>development</Code> might point to a local Postgres
        instance, while in <Code>production</Code> it points to your managed cloud database.
      </P>

      <H2 id="lifecycle">Secret Lifecycle</H2>

      <H3>Creating a secret</H3>
      <P>
        When you create a secret, it starts at version 1. The key is stored as-is; the value
        is encrypted server-side before being written to the database.
      </P>
      <CodeBlock lang="HTTP">
{`POST /api/v1/projects/:projectId/secrets
Content-Type: application/json

{
  "key": "STRIPE_SECRET_KEY",
  "value": "sk_live_xxxxxxxxxxxx",
  "environment": "production",
  "expiresAt": "2025-12-31"   // optional
}`}
      </CodeBlock>

      <H3>Revealing a secret</H3>
      <P>
        The list endpoint never returns values. To get the actual value you must call the reveal
        endpoint. This is intentional — it creates an audit entry every time a value is accessed.
      </P>
      <CodeBlock lang="HTTP">
{`GET /api/v1/projects/:projectId/secrets/:secretId/reveal

// Response
{
  "status": "success",
  "data": {
    "value": "sk_live_xxxxxxxxxxxx"
  }
}`}
      </CodeBlock>

      <Callout type="info" title="Auto-hide in the UI">
        In the Vaulto dashboard, revealed values are automatically hidden after 8 seconds.
        They are never stored in Redux state beyond the current session and are cleared
        on page navigation.
      </Callout>

      <H3>Rotating a secret</H3>
      <P>
        Rotating a secret creates a new version with a new value. The previous version is archived
        in the version history — accessible for audit purposes but the value is not displayed.
        The current version is always the one used.
      </P>
      <CodeBlock lang="HTTP">
{`POST /api/v1/projects/:projectId/secrets/:secretId/rotate

{
  "value": "sk_live_new_value_xxxx"
}`}
      </CodeBlock>

      <H3>Version history</H3>
      <P>
        Every rotation creates a new version. The version history shows metadata only — who
        changed it and when. You can view the history in the dashboard by clicking the clock
        icon next to any secret.
      </P>
      <CodeBlock lang="HTTP">
{`GET /api/v1/projects/:projectId/secrets/:secretId/versions

// Response — metadata only, no values ever
{
  "data": [
    { "version": 3, "changedBy": { "email": "jane@company.com" }, "createdAt": "2024-12-20T14:32:00Z" },
    { "version": 2, "changedBy": { "email": "dev@company.com"  }, "createdAt": "2024-12-18T09:11:00Z" },
    { "version": 1, "changedBy": { "email": "jane@company.com" }, "createdAt": "2024-12-15T16:00:00Z" }
  ]
}`}
      </CodeBlock>

      <H3>Deleting a secret</H3>
      <P>
        Secrets are soft-deleted by default — they are marked as deleted but remain in the
        database for audit trail purposes. An admin can restore them.
      </P>

      <H2 id="expiry">Secret Expiry</H2>
      <P>
        You can set an optional expiry date on any secret. Secrets that are close to expiring
        (within 7 days) will show a warning badge in the dashboard. The dashboard summary
        also shows a count of expiring secrets so you never miss a rotation.
      </P>

      <Callout type="danger" title="Expired secrets are not automatically deleted">
        Vaulto flags expiring secrets but does not auto-delete them. You are responsible for
        rotating or removing expired secrets. This is intentional — silent deletion of
        production secrets would be too dangerous.
      </Callout>

      <H2 id="naming">Key Naming Conventions</H2>
      <P>
        Vaulto enforces that secret keys use only uppercase letters, numbers, and underscores.
        This matches the convention used by most platforms (Heroku, Render, Railway, Vercel)
        so your keys are portable.
      </P>

      <DocTable
        headers={['Valid', 'Invalid', 'Reason']}
        rows={[
          [<Code>DATABASE_URL</Code>,     <Code>database-url</Code>,    'Hyphens not allowed'],
          [<Code>STRIPE_SECRET_KEY</Code>,<Code>stripe secret key</Code>,'Spaces not allowed'],
          [<Code>API_KEY_V2</Code>,       <Code>api_key_v2</Code>,      'Must be uppercase'],
          [<Code>JWT_SECRET_256</Code>,   <Code>jwt.secret</Code>,      'Dots not allowed'],
        ]}
      />
    </DocsLayout>
  )
}

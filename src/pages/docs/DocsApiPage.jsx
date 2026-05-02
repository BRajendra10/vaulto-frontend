import DocsLayout from '../../components/public/DocsLayout'
import {
  H1, H2, H3, Lead, P, Code, CodeBlock,
  Callout, DocTable, DocBadge, Divider
} from '../../components/public/DocsUI'

function Method({ m }) {
  const colors = {
    GET:    { bg: 'rgba(45,212,160,0.1)',  color: '#2dd4a0' },
    POST:   { bg: 'rgba(96,165,250,0.1)',  color: '#60a5fa' },
    PATCH:  { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24' },
    DELETE: { bg: 'rgba(248,113,113,0.1)', color: '#f87171' },
  }
  const s = colors[m] || {}
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 5,
      fontSize: 11, fontWeight: 700, fontFamily: 'DM Mono, monospace',
      background: s.bg, color: s.color, marginRight: 10, flexShrink: 0,
    }}>
      {m}
    </span>
  )
}

function RouteBlock({ method, path, title, what, request, response, notes }) {
  return (
    <div style={{
      background: '#0f0f16',
      border: '1px solid rgba(120,120,180,0.15)',
      borderRadius: 10, overflow: 'hidden',
      marginBottom: 28,
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 20px',
        borderBottom: '1px solid rgba(120,120,180,0.1)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Method m={method} />
        <code style={{
          fontFamily: 'DM Mono, monospace', fontSize: 13.5,
          color: '#c8c8e0', flex: 1,
        }}>
          {path}
        </code>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 600,
          fontSize: 14, color: '#e8e8f0', marginBottom: 6,
        }}>
          {title}
        </div>
        <p style={{ fontSize: 13.5, color: '#8888a0', lineHeight: 1.7, marginBottom: 16 }}>
          {what}
        </p>

        {request && (
          <>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#555568', marginBottom: 8 }}>
              Request
            </div>
            <pre style={{
              background: '#141420', border: '1px solid rgba(120,120,180,0.1)',
              borderRadius: 7, padding: '14px 16px', margin: '0 0 16px',
              fontFamily: 'DM Mono, monospace', fontSize: 12.5,
              color: '#c8c8e0', lineHeight: 1.7, overflowX: 'auto',
            }}>
              {request}
            </pre>
          </>
        )}

        {response && (
          <>
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.6px', textTransform: 'uppercase', color: '#555568', marginBottom: 8 }}>
              Response
            </div>
            <pre style={{
              background: '#141420', border: '1px solid rgba(120,120,180,0.1)',
              borderRadius: 7, padding: '14px 16px', margin: '0 0 16px',
              fontFamily: 'DM Mono, monospace', fontSize: 12.5,
              color: '#c8c8e0', lineHeight: 1.7, overflowX: 'auto',
            }}>
              {response}
            </pre>
          </>
        )}

        {notes && (
          <div style={{
            background: 'rgba(124,106,247,0.07)',
            border: '1px solid rgba(124,106,247,0.2)',
            borderRadius: 7, padding: '10px 14px',
            fontSize: 13, color: '#8888a0', lineHeight: 1.6,
          }}>
            <span style={{ color: '#a394f9', fontWeight: 600 }}>Note: </span>{notes}
          </div>
        )}
      </div>
    </div>
  )
}

export default function DocsApiPage() {
  return (
    <DocsLayout>
      <DocBadge color="amber">Integration</DocBadge>
      <H1>REST API Reference</H1>
      <Lead>
        These are the routes your application, CI/CD pipeline, or deployment script
        will actually call when integrating with Vaulto. Each route is explained with
        what it does, what you send, and what you get back.
      </Lead>

      <Callout type="info" title="All responses share the same envelope">
{`{ "status": "success" | "error", "message": "...", "data": any, "errors": [] }`}
      </Callout>

      <Callout type="warning" title="Authentication">
        All routes below require you to be logged in. Requests are authenticated via{' '}
        <Code>httpOnly</Code> cookies set at login. From a browser, cookies are sent
        automatically. From a server script, pass the cookie header manually after
        obtaining it via the login flow.
      </Callout>

      {/* ── PROJECTS ── */}
      <H2 id="projects">Projects</H2>
      <P>
        A project is the top-level container for your secrets. Everything — secrets,
        members, audit logs — lives inside a project. You'll typically have one project
        per application or service.
      </P>

      <RouteBlock
        method="GET"
        path="/api/v1/projects"
        title="List your projects"
        what="Returns all projects you are a member of. Use this to find the projectId you need before fetching secrets. The response includes secret and member counts so you can display a summary without extra requests."
        response={`{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "prj_abc123",
        "name": "api-gateway",
        "description": "Main API gateway secrets",
        "environment": "production",
        "secretsCount": 24,
        "membersCount": 6,
        "updatedAt": "2024-12-20T14:32:00Z"
      }
    ]
  }
}`}
        notes="Values are never included here. You only see keys and counts."
      />

      <RouteBlock
        method="POST"
        path="/api/v1/projects"
        title="Create a project"
        what="Creates a new project. You become the admin automatically. The name must use only lowercase letters, numbers, hyphens, or underscores — this keeps project names shell-safe for use in scripts."
        request={`{
  "name": "api-gateway",
  "description": "Main API gateway configuration",
  "environment": "production"   // default environment for new secrets
}`}
        response={`{
  "status": "success",
  "data": {
    "id": "prj_abc123",
    "name": "api-gateway",
    "environment": "production",
    "createdAt": "2024-12-20T14:00:00Z"
  }
}`}
      />

      <RouteBlock
        method="GET"
        path="/api/v1/projects/:projectId"
        title="Get a single project"
        what="Fetches full details for one project by its ID. Use this to show the project name, description, and environment on the project detail page. Does not include secrets — fetch those separately."
        response={`{
  "status": "success",
  "data": {
    "id": "prj_abc123",
    "name": "api-gateway",
    "description": "Main API gateway configuration",
    "environment": "production",
    "secretsCount": 24,
    "membersCount": 6,
    "createdAt": "2024-12-15T08:00:00Z",
    "updatedAt": "2024-12-20T14:32:00Z"
  }
}`}
      />

      {/* ── SECRETS ── */}
      <H2 id="secrets">Secrets</H2>
      <P>
        These are the routes you'll use most. Fetching the list is safe to call frequently —
        it never returns values. The reveal route is the only way to get an actual secret value,
        and every call to it creates an audit entry.
      </P>

      <RouteBlock
        method="GET"
        path="/api/v1/projects/:projectId/secrets"
        title="List secrets in a project"
        what="Returns all secrets in the project — keys, environments, versions, and statuses — but never the values. Filter by environment using the query parameter. This is what the dashboard calls to render the secrets table."
        request={`// Optional query parameter to filter by environment
GET /api/v1/projects/prj_abc123/secrets?environment=production`}
        response={`{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "sec_xyz789",
        "key": "DATABASE_URL",
        "environment": "production",
        "version": 3,
        "status": "active",
        "expiresAt": null,
        "updatedAt": "2024-12-20T14:32:00Z"
      },
      {
        "id": "sec_xyz790",
        "key": "STRIPE_SECRET_KEY",
        "environment": "production",
        "version": 1,
        "status": "expiring",
        "expiresAt": "2024-12-27T00:00:00Z",
        "updatedAt": "2024-12-01T09:00:00Z"
      }
    ]
  }
}`}
        notes="The value field is intentionally absent. Call the reveal endpoint to get it."
      />

      <RouteBlock
        method="GET"
        path="/api/v1/projects/:projectId/secrets/:secretId/reveal"
        title="Reveal a secret value"
        what="The only route that returns an actual secret value. Requires the developer or admin role — viewers cannot call this. Every call creates an immutable audit log entry recording who revealed it and when. In the dashboard, revealed values auto-hide after 8 seconds and are never written to disk."
        response={`{
  "status": "success",
  "data": {
    "value": "postgresql://user:pass@db.host:5432/mydb"
  }
}`}
        notes="This is a GET rather than POST because it does not change state — it only reads. The audit log is a side effect, not a write to the secret itself."
      />

      <RouteBlock
        method="POST"
        path="/api/v1/projects/:projectId/secrets"
        title="Create a secret"
        what="Adds a new secret to the project. The key must be uppercase with underscores only — this matches the convention used by Heroku, Render, Railway, and most deployment platforms so your keys are portable. The value is encrypted server-side before storage."
        request={`{
  "key": "DATABASE_URL",
  "value": "postgresql://user:pass@host:5432/mydb",
  "environment": "production",
  "expiresAt": "2025-06-01"   // optional ISO date
}`}
        response={`{
  "status": "success",
  "data": {
    "id": "sec_xyz789",
    "key": "DATABASE_URL",
    "environment": "production",
    "version": 1,
    "status": "active",
    "expiresAt": "2025-06-01T00:00:00Z",
    "createdAt": "2024-12-20T14:00:00Z"
  }
}`}
      />

      <RouteBlock
        method="POST"
        path="/api/v1/projects/:projectId/secrets/:secretId/rotate"
        title="Rotate a secret to a new value"
        what="Updates the secret's value and increments the version number. The old value is archived in version history — you can see it was changed and by whom, but the old value itself is not retrievable. Use this when rotating API keys, regenerating passwords, or rolling credentials after a potential leak."
        request={`{
  "value": "postgresql://user:newpass@host:5432/mydb"
}`}
        response={`{
  "status": "success",
  "data": {
    "id": "sec_xyz789",
    "key": "DATABASE_URL",
    "environment": "production",
    "version": 4,   // incremented from 3 to 4
    "status": "active",
    "updatedAt": "2024-12-20T15:00:00Z"
  }
}`}
        notes="Rotation is not the same as update — it always creates a new version. If you just want to fix a typo and the secret has never been used in production, delete and recreate it instead."
      />

      <RouteBlock
        method="DELETE"
        path="/api/v1/projects/:projectId/secrets/:secretId"
        title="Delete a secret"
        what="Soft-deletes the secret — it is marked as deleted but remains in the database for audit trail continuity. An admin can restore it. The secret will no longer appear in the list response after deletion."
        response={`{
  "status": "success",
  "message": "Secret deleted"
}`}
        notes="Soft delete means your audit logs stay intact. You can always see that DATABASE_URL existed and was deleted on a specific date by a specific person."
      />

      <RouteBlock
        method="GET"
        path="/api/v1/projects/:projectId/secrets/:secretId/versions"
        title="Get version history"
        what="Returns the version history of a secret — who changed it and when, across all past rotations. Values are never included in version history. Use this to audit when a credential was last rotated and by whom."
        response={`{
  "status": "success",
  "data": [
    {
      "version": 3,
      "changedBy": { "email": "jane@company.com" },
      "createdAt": "2024-12-20T14:32:00Z"
    },
    {
      "version": 2,
      "changedBy": { "email": "dev@company.com" },
      "createdAt": "2024-12-18T09:11:00Z"
    },
    {
      "version": 1,
      "changedBy": { "email": "jane@company.com" },
      "createdAt": "2024-12-15T16:00:00Z"
    }
  ]
}`}
        notes="This is metadata only — past values are never returned regardless of your role."
      />

      {/* ── MEMBERS ── */}
      <H2 id="members">Members</H2>
      <P>
        Use these routes to manage who has access to a project. Only admins can invite,
        change roles, or remove members.
      </P>

      <RouteBlock
        method="GET"
        path="/api/v1/projects/:projectId/members"
        title="List project members"
        what="Returns all members of the project with their roles. Useful for displaying the team on the members tab, and for checking what role the current user has within this project."
        response={`{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "mem_001",
        "userId": "usr_abc",
        "name": "Jane Doe",
        "email": "jane@company.com",
        "role": "admin"
      },
      {
        "id": "mem_002",
        "userId": "usr_def",
        "name": "Alex Kim",
        "email": "alex@company.com",
        "role": "developer"
      }
    ]
  }
}`}
      />

      <RouteBlock
        method="POST"
        path="/api/v1/projects/:projectId/members"
        title="Invite a member"
        what="Adds a user to the project by email. The user must already have a Vaulto account. You can only assign developer or viewer — the admin role cannot be granted through invite. The invited user gets immediate access with no email confirmation step."
        request={`{
  "email": "colleague@company.com",
  "role": "developer"   // "developer" or "viewer" only
}`}
        response={`{
  "status": "success",
  "data": {
    "id": "mem_003",
    "email": "colleague@company.com",
    "role": "developer"
  }
}`}
        notes="You cannot invite someone who is already a member. If you want to change their role, use the PATCH endpoint instead."
      />

      <RouteBlock
        method="PATCH"
        path="/api/v1/projects/:projectId/members/:memberId"
        title="Change a member's role"
        what="Updates the role of an existing member. The role hierarchy rule applies — you cannot change the role of someone with an equal or higher role than you. An admin cannot demote another admin."
        request={`{
  "role": "viewer"
}`}
        response={`{
  "status": "success",
  "data": {
    "id": "mem_002",
    "email": "alex@company.com",
    "role": "viewer"
  }
}`}
      />

      <RouteBlock
        method="DELETE"
        path="/api/v1/projects/:projectId/members/:memberId"
        title="Remove a member"
        what="Removes a user from the project immediately. Their access is revoked on the next request they make. This does not delete their Vaulto account or affect their membership in other projects."
        response={`{
  "status": "success",
  "message": "Member removed"
}`}
        notes="You cannot remove yourself if you are the only admin. Promote someone else to admin first."
      />

      {/* ── AUDIT ── */}
      <H2 id="audit">Audit Logs</H2>
      <P>
        The audit log gives you a complete, immutable history of everything that happened
        in a project. Use it to answer questions like "who revealed the production database
        password last Tuesday?" or "when was this key last rotated?"
      </P>

      <RouteBlock
        method="GET"
        path="/api/v1/projects/:projectId/audit"
        title="Get project audit logs"
        what="Returns a chronological list of all actions taken in the project. Filter by action type and date range to narrow results. Every entry records who did it, what they did, which resource was affected, and exactly when."
        request={`// All query params are optional
GET /api/v1/projects/prj_abc123/audit
  ?action=SECRET_REVEAL   // filter by action type
  &from=2024-12-01        // start date (ISO)
  &to=2024-12-31          // end date (ISO)`}
        response={`{
  "status": "success",
  "data": {
    "items": [
      {
        "id": "log_001",
        "action": "SECRET_REVEAL",
        "resourceKey": "DATABASE_URL",
        "actor": {
          "email": "jane@company.com"
        },
        "createdAt": "2024-12-20T14:32:00Z"
      },
      {
        "id": "log_002",
        "action": "SECRET_ROTATE",
        "resourceKey": "STRIPE_SECRET_KEY",
        "actor": {
          "email": "dev@company.com"
        },
        "createdAt": "2024-12-18T09:11:00Z"
      }
    ]
  }
}`}
        notes="Audit logs are immutable — they cannot be deleted even by admins. This is intentional."
      />

      <H2 id="action-types">Audit Action Types</H2>
      <DocTable
        headers={['Action', 'What triggered it']}
        rows={[
          [<Code>SECRET_CREATE</Code>,      'A new secret was added to the project'],
          [<Code>SECRET_REVEAL</Code>,      'A secret value was revealed by a user'],
          [<Code>SECRET_ROTATE</Code>,      'A secret was rotated to a new value'],
          [<Code>SECRET_UPDATE</Code>,      'A secret\'s metadata was changed (not the value)'],
          [<Code>SECRET_DELETE</Code>,      'A secret was soft-deleted'],
          [<Code>MEMBER_ADD</Code>,         'A new member was invited to the project'],
          [<Code>MEMBER_REMOVE</Code>,      'A member was removed from the project'],
          [<Code>MEMBER_ROLE_UPDATE</Code>, 'A member\'s role was changed'],
          [<Code>PROJECT_UPDATE</Code>,     'Project name, description, or settings were changed'],
        ]}
      />

      <H2 id="errors">Error Responses</H2>
      <DocTable
        headers={['Status', 'Meaning', 'What to do']}
        rows={[
          ['400', 'Bad Request',  'Check the request body — a required field is missing or invalid'],
          ['401', 'Unauthorized', 'Your session has expired — re-authenticate'],
          ['403', 'Forbidden',    'Your role doesn\'t allow this action — check the permission matrix'],
          ['404', 'Not Found',    'The project, secret, or member ID doesn\'t exist or you don\'t have access'],
          ['409', 'Conflict',     'A secret with this key already exists in this environment'],
          ['500', 'Server Error', 'Something went wrong on the server — try again or contact support'],
        ]}
      />
    </DocsLayout>
  )
}

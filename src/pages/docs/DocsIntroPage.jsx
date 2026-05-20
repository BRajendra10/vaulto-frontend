import { Link } from 'react-router-dom'
import DocsLayout from '../../components/public/DocsLayout'
import { H1, H2, H3, Lead, P, Code, CodeBlock, Callout, Steps, Step, DocBadge } from '../../components/public/DocsUI'

export default function DocsIntroPage() {
  return (
    <DocsLayout>
      <DocBadge color="purple">Getting Started</DocBadge>
      <H1 style={{ marginTop: 12 }}>Introduction to Vaulto</H1>
      <Lead>
        Vaulto is a team secrets management platform. Store API keys, database credentials, tokens,
        and any sensitive configuration — securely, with full audit trails and role-based access control.
      </Lead>

      <P>
        Instead of sharing secrets over Slack, committing them to Git, or storing them in spreadsheets,
        Vaulto gives your team a single secure place to manage secrets across environments —
        with fine-grained access control and a complete history of who accessed or changed what.
      </P>

      <Callout type="success" title="No client-side encryption libraries">
        Vaulto handles all encryption server-side. Your frontend never touches raw keys or tokens —
        values are only ever returned to the client on an explicit, audited "reveal" action.
      </Callout>

      <H2 id="quickstart">Quick Start</H2>
      <P>Get your first secret stored in under 2 minutes.</P>

      <Steps>
        <Step n={1} title="Create an account">
          Head to <Link to="/register" style={{ color: '#a394f9' }}>vaulto.app/register</Link> and
          sign up with your full name and email. You'll receive a 6-digit OTP to verify your account before you can log in.
        </Step>
        <Step n={2} title="Create a project">
          A <strong style={{ color: '#e8e8f0' }}>Project</strong> is a container for related secrets —
          typically one per application or service. Give it a name like <Code>my-api</Code> and
          choose a default environment.
        </Step>
        <Step n={3} title="Add your first secret">
          Inside the project, go to the <strong style={{ color: '#e8e8f0' }}>Secrets</strong> tab
          and click <strong style={{ color: '#e8e8f0' }}>Add Secret</strong>. Enter a key like{' '}
          <Code>DATABASE_URL</Code>, your value, and choose the environment it belongs to.
        </Step>
        <Step n={4} title="Reveal or copy when you need it">
          Secret values are masked by default. Click the <strong style={{ color: '#e8e8f0' }}>eye icon</strong>{' '}
          to reveal a value — it auto-hides after 8 seconds. Every reveal is logged in the audit trail.
        </Step>
        <Step n={5} title="Invite your team">
          Go to the <strong style={{ color: '#e8e8f0' }}>Members</strong> tab and invite teammates
          by email. Assign them <Code>developer</Code> or <Code>viewer</Code> roles depending on
          what access they need.
        </Step>
      </Steps>

      <H2 id="concepts">Core Concepts</H2>

      <H3>Projects</H3>
      <P>
        Everything in Vaulto lives inside a project. A project maps to one application, service, or
        repository. It has its own secrets, members, and audit log. You can be a member of multiple
        projects with different roles in each.
      </P>

      <H3>Secrets</H3>
      <P>
        A secret is a key-value pair tied to a specific environment. The same key (e.g.{' '}
        <Code>DATABASE_URL</Code>) can exist in <Code>development</Code>, <Code>staging</Code>, and{' '}
        <Code>production</Code> with different values. Secret values are never returned in list
        responses — only on explicit reveal.
      </P>

      <H3>Environments</H3>
      <P>
        Vaulto supports three environments: <Code>development</Code>, <Code>staging</Code>, and{' '}
        <Code>production</Code>. You can filter secrets by environment and your team's access
        controls can be configured accordingly.
      </P>

      <H3>Audit Logs</H3>
      <P>
        Every action — creating, revealing, rotating, or deleting a secret, adding or removing a
        member, changing roles — is recorded in the project's immutable audit log. You always know
        who did what and when.
      </P>

      <H2 id="next">What to read next</H2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {[
          { to: '/docs/secrets',     title: 'Secrets & Environments', desc: 'How secrets are stored, versioned, and managed across environments' },
          { to: '/docs/rbac',        title: 'Roles & Access Control', desc: 'Admin, developer, and viewer roles explained' },
          { to: '/docs/security',    title: 'Security Model',         desc: 'How tokens, cookies, and encryption work' },
          { to: '/docs/api',         title: 'REST API Reference',     desc: 'Integrate Vaulto directly into your CI/CD pipeline' },
        ].map(card => (
          <Link key={card.to} to={card.to} style={{
            textDecoration: 'none', display: 'block',
            background: '#0f0f16', border: '1px solid rgba(120,120,180,0.12)',
            borderRadius: 10, padding: '16px 18px',
            transition: 'border-color 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,106,247,0.4)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(120,120,180,0.12)'}
          >
            <div style={{ fontWeight: 600, fontSize: 13.5, color: '#e8e8f0', marginBottom: 5 }}>{card.title} →</div>
            <div style={{ fontSize: 12.5, color: '#555568', lineHeight: 1.5 }}>{card.desc}</div>
          </Link>
        ))}
      </div>
    </DocsLayout>
  )
}

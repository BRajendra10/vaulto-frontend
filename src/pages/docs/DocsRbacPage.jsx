import DocsLayout from '../../components/public/DocsLayout'
import { H1, H2, H3, Lead, P, Code, CodeBlock, Callout, DocTable, DocBadge, Divider } from '../../components/public/DocsUI'

const Check = () => <span style={{ color: '#2dd4a0', fontWeight: 600 }}>✓</span>
const Cross = () => <span style={{ color: '#f87171', fontWeight: 600 }}>✗</span>

export default function DocsRbacPage() {
  return (
    <DocsLayout>
      <DocBadge color="blue">Core Concepts</DocBadge>
      <H1>Roles &amp; Access Control</H1>
      <Lead>
        Vaulto uses role-based access control (RBAC) to determine what each team member can
        do within a project. Roles are assigned per-project, so the same person can be an
        admin on one project and a viewer on another.
      </Lead>

      <H2 id="roles">The Three Roles</H2>
      <P>
        There are three roles in Vaulto, ordered from most to least privileged:
      </P>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 28 }}>
        {[
          {
            role: 'Admin',
            color: '#a394f9',
            bg: 'rgba(124,106,247,0.08)',
            border: 'rgba(124,106,247,0.25)',
            desc: 'Full control. Manages secrets, members, and project settings. Can invite and remove members.',
          },
          {
            role: 'Developer',
            color: '#60a5fa',
            bg: 'rgba(96,165,250,0.08)',
            border: 'rgba(96,165,250,0.25)',
            desc: 'Can create, reveal, rotate, and delete secrets. Cannot manage team members or project settings.',
          },
          {
            role: 'Viewer',
            color: '#8888a0',
            bg: 'rgba(120,120,140,0.08)',
            border: 'rgba(120,120,140,0.25)',
            desc: 'Read-only. Can see secret keys and metadata but cannot reveal values or make changes.',
          },
        ].map(r => (
          <div key={r.role} style={{
            background: r.bg, border: `1px solid ${r.border}`,
            borderRadius: 10, padding: '18px 20px',
          }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: r.color, marginBottom: 8, fontFamily: 'Syne, sans-serif' }}>
              {r.role}
            </div>
            <div style={{ fontSize: 13, color: '#8888a0', lineHeight: 1.6 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      <H2 id="permissions">Permission Matrix</H2>

      <DocTable
        headers={['Action', 'Admin', 'Developer', 'Viewer']}
        rows={[
          ['View secret keys & metadata', <Check />, <Check />, <Check />],
          ['Reveal secret values',        <Check />, <Check />, <Cross />],
          ['Create secrets',              <Check />, <Check />, <Cross />],
          ['Rotate secrets',              <Check />, <Check />, <Cross />],
          ['Delete secrets',              <Check />, <Check />, <Cross />],
          ['View audit logs',             <Check />, <Check />, <Check />],
          ['View team members',           <Check />, <Check />, <Check />],
          ['Invite members',              <Check />, <Cross />, <Cross />],
          ['Change member roles',         <Check />, <Cross />, <Cross />],
          ['Remove members',              <Check />, <Cross />, <Cross />],
          ['Edit project settings',       <Check />, <Cross />, <Cross />],
          ['Delete project',              <Check />, <Cross />, <Cross />],
        ]}
      />

      <H2 id="hierarchy">Role Hierarchy Rule</H2>
      <P>
        A critical rule in Vaulto: <strong style={{ color: '#e8e8f0' }}>you cannot modify or remove a user
        who has an equal or higher role than you.</strong>
      </P>
      <P>
        This means an admin cannot remove another admin. Only a higher-privilege action (e.g. the
        project owner) can do that. In practice, the first user to create a project is the owner
        and is the only one who can manage other admins.
      </P>

      <Callout type="warning" title="UI enforcement">
        The Vaulto dashboard hides or disables actions you don't have permission to perform.
        The backend enforces these rules independently — UI restrictions are a convenience,
        not a security boundary.
      </Callout>

      <H2 id="assigning">Assigning Roles</H2>
      <P>
        When inviting a member, admins can only assign <Code>developer</Code> or <Code>viewer</Code>.
        The <Code>admin</Code> role cannot be assigned through the invite flow — it must be promoted
        after the member has joined.
      </P>

      <CodeBlock lang="HTTP">
{`// Invite a new member
POST /api/v1/projects/:projectId/members
{
  "email": "colleague@company.com",
  "role": "developer"
}

// Update an existing member's role
PATCH /api/v1/projects/:projectId/members/:memberId
{
  "role": "viewer"
}`}
      </CodeBlock>

      <H2 id="per-project">Roles are Per-Project</H2>
      <P>
        A user's role is scoped to a specific project. The same person can be:
      </P>
      <ul style={{ paddingLeft: 20, marginBottom: 20, color: '#8888a0', fontSize: 13.5, lineHeight: 2 }}>
        <li>An <Code>admin</Code> on the <Code>api-gateway</Code> project</li>
        <li>A <Code>developer</Code> on the <Code>mobile-backend</Code> project</li>
        <li>A <Code>viewer</Code> on the <Code>data-pipeline</Code> project</li>
      </ul>
      <P>
        Their account-level role (set during registration) is separate from their project roles.
        Project roles always take precedence for actions within a project.
      </P>

      <H2 id="removing">Removing Access</H2>
      <P>
        When you remove a member from a project, their access is revoked immediately. They will
        no longer be able to see the project, its secrets, or its audit logs. Any active sessions
        they have are invalidated for that project on the next request.
      </P>

      <Callout type="info">
        Removing a member does not delete their account or affect their membership in other projects.
      </Callout>
    </DocsLayout>
  )
}

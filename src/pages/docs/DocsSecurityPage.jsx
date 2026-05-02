import DocsLayout from '../../components/public/DocsLayout'
import { H1, H2, H3, Lead, P, Code, CodeBlock, Callout, DocTable, DocBadge, Divider } from '../../components/public/DocsUI'

export default function DocsSecurityPage() {
  return (
    <DocsLayout>
      <DocBadge color="green">Core Concepts</DocBadge>
      <H1>Security Model</H1>
      <Lead>
        Vaulto is built around the principle that sensitive values should never be more accessible
        than they need to be. This page explains how authentication, token storage, and secret
        encryption work under the hood.
      </Lead>

      <H2 id="auth">Authentication</H2>
      <P>
        Vaulto uses a two-token authentication system: a short-lived <strong style={{ color: '#e8e8f0' }}>access token</strong> and
        a longer-lived <strong style={{ color: '#e8e8f0' }}>refresh token</strong>. Both are stored
        as <Code>httpOnly</Code> cookies — never in <Code>localStorage</Code> or JavaScript memory.
      </P>

      <DocTable
        headers={['Token', 'Lifetime', 'Storage', 'Purpose']}
        rows={[
          [<Code>accessToken</Code>,  '15 minutes', <><Code>httpOnly</Code> cookie</>, 'Authenticates every API request'],
          [<Code>refreshToken</Code>, '7 days',     <><Code>httpOnly</Code> cookie</>, 'Issues new access tokens silently'],
        ]}
      />

      <H3>Why httpOnly cookies?</H3>
      <P>
        <Code>httpOnly</Code> cookies cannot be read or modified by JavaScript running in the browser.
        This means even if an attacker injects malicious JavaScript into your page (XSS), they cannot
        steal your tokens. The browser sends them automatically with every request to the server —
        your frontend code never touches them.
      </P>

      <Callout type="danger" title="Never store tokens in localStorage">
        Any token stored in <Code>localStorage</Code> or <Code>sessionStorage</Code> can be read by
        any JavaScript on the page. Vaulto explicitly prohibits this. The frontend has no access to
        token values at any point.
      </Callout>

      <H2 id="token-refresh">Silent Token Refresh</H2>
      <P>
        When your access token expires (after 15 minutes), Vaulto's Axios interceptor automatically
        calls the refresh endpoint to get a new one — without interrupting your session or requiring
        you to log in again.
      </P>

      <CodeBlock lang="Flow">
{`Request made
  → Server returns 401 (access token expired)
  → Interceptor calls POST /auth/refresh
     → Refresh token valid? → New access token issued
     → Refresh token expired? → Redirect to /login
  → Original request retried with new token`}
      </CodeBlock>

      <P>
        If multiple requests fail simultaneously (e.g. the page loads several things at once),
        only one refresh request is made. The rest are queued and retried after the refresh completes.
      </P>

      <H2 id="secret-encryption">Secret Value Encryption</H2>
      <P>
        Secret values are encrypted at rest on the server before being written to the database.
        The encryption is handled entirely server-side using AES-256.
      </P>

      <Callout type="info" title="The frontend never encrypts or decrypts anything">
        Vaulto's frontend sends plaintext values over HTTPS to the server, which encrypts them before
        storage. When you reveal a secret, the server decrypts it and returns the plaintext over HTTPS.
        No encryption libraries are included in the frontend bundle.
      </Callout>

      <H3>Why not client-side encryption?</H3>
      <P>
        Client-side encryption sounds safer but has serious usability tradeoffs: key management becomes
        the user's problem, search and audit become impossible, and sharing secrets between team members
        requires complex key exchange. For a team tool, server-side encryption with strong access controls
        is the right tradeoff.
      </P>

      <H2 id="reveal-model">The Reveal Model</H2>
      <P>
        Secret values follow a "pull, not push" model. The API never includes values in list responses —
        you must explicitly request a value by calling the reveal endpoint. Every reveal is:
      </P>
      <ul style={{ paddingLeft: 20, marginBottom: 20, color: '#8888a0', fontSize: 13.5, lineHeight: 2 }}>
        <li>Gated by role (viewers cannot reveal)</li>
        <li>Logged in the project's audit trail with timestamp and user identity</li>
        <li>Returned only over HTTPS</li>
      </ul>
      <P>
        In the dashboard, revealed values are held in Redux memory only — they are never written
        to disk, <Code>localStorage</Code>, or any persistent store. They auto-clear after 8 seconds.
      </P>

      <H2 id="cors">CORS &amp; Cookie Security</H2>
      <P>
        For cookies to be sent cross-origin (e.g. your frontend at <Code>app.vaulto.dev</Code> calling
        an API at <Code>api.vaulto.dev</Code>), two things must be true:
      </P>
      <ul style={{ paddingLeft: 20, marginBottom: 20, color: '#8888a0', fontSize: 13.5, lineHeight: 2 }}>
        <li>The API must set <Code>Access-Control-Allow-Origin</Code> to the exact frontend origin (not <Code>*</Code>)</li>
        <li>The API must set <Code>Access-Control-Allow-Credentials: true</Code></li>
        <li>The frontend must send requests with <Code>withCredentials: true</Code> (already configured in Axios)</li>
      </ul>

      <Callout type="warning" title="HTTPS is required in production">
        The <Code>Secure</Code> flag on cookies means they are only sent over HTTPS.
        In development with <Code>localhost</Code>, cookies work over HTTP. In production,
        HTTPS is mandatory — cookies will not be sent over plain HTTP.
      </Callout>

      <H2 id="otp">Email Verification</H2>
      <P>
        New accounts require email verification via a 6-digit OTP before they can log in.
        This prevents account creation with fake or typo'd email addresses and ensures
        you can always reach the account owner for password resets.
      </P>

      <H2 id="sessions">Session Management</H2>
      <P>
        From your profile page you can terminate all active sessions across all devices with
        a single click. This invalidates all refresh tokens associated with your account —
        any device still holding a refresh token will be forced to log in again on their
        next request.
      </P>

      <CodeBlock lang="HTTP">
{`// Logout current device only
POST /api/v1/auth/logout

// Logout all devices (invalidates all refresh tokens)
POST /api/v1/auth/logout-all`}
      </CodeBlock>
    </DocsLayout>
  )
}

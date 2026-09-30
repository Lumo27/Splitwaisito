import { Redirect } from 'expo-router'

// Sin sesión todavía: siempre arranca en el login.
export default function Index() {
  return <Redirect href="/login" />
}

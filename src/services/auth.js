import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

export async function getAuthenticatedUser() {
  try {
    const session = await fetchAuthSession();
    const user = await getCurrentUser();

    if (!session.tokens) {
      return null;
    }

    return {
      id: user.userId,
      email: user.signInDetails?.loginId || '',
      username: user.username,
    };
  } catch (error) {
    return null;
  }
}

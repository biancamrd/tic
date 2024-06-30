import { auth } from '../../firebaseConfig';

const getAxiosConfig = async () => {
  try {
    const idToken = await auth.currentUser.getIdToken();
    const config = {
      headers: {
        'Authorization': `Bearer ${idToken}`,
        'Content-Type': 'application/json'
      }
    };
    return config;
  } catch (error) {
    console.error('Error obtaining Axios configuration:', error);
    throw error;
  }
};

export default getAxiosConfig;

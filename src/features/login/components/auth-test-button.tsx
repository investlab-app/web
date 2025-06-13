import { useAuth } from '@clerk/clerk-react';

type AuthTestButtonProps = {
  url: string;
  auth: boolean;
};

export function AuthTestButton({ url, auth }: AuthTestButtonProps) {
  const { getToken } = useAuth();

  const handleClick = async () => {
    if (auth) {
      try {
        const token = await getToken();
        console.log(token);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Server response:', data);
      } catch (error) {
        console.error('Error sending request:', error);
      }
    } else {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Server response:', data);
      } catch (error) {
        console.error('Error sending request:', error);
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
    >
      Test Auth Request
    </button>
  );
}

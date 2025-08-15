// import { notFound } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';

export type PostType = {
  id: string;
  title: string;
  body: string;
};

export const fetchPost = createServerFn({ method: 'GET' })
  .validator((postId: string) => postId)
  .handler(async ({ data }) => {
    console.info(`Fetching post with id ${data}...`);
    // const post = await axios
    //   .get<PostType>(`https://jsonplaceholder.typicode.com/posts/${data}`)
    //   .then((r) => r.data)
    //   .catch((err) => {
    //     console.error(err)
    //     if (err.status === 404) {
    //       throw notFound()
    //     }
    //     throw err
    //   })

    // return post
    return Promise.resolve({
      userId: 1,
      id: 1,
      title:
        'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
      body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
    });
  });

export const fetchPosts = createServerFn({ method: 'GET' }).handler(
  async () => {
    console.info('Fetching posts...');
    await new Promise((r) => setTimeout(r, 1000));
    return axios
      .get<Array<PostType>>('https://jsonplaceholder.typicode.com/posts')
      .then((r) => r.data.slice(0, 10));
  }
);

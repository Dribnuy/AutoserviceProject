import { blogService } from './services/firebase/BlogService';

// Використовуємо анонімну асинхронну функцію (IIFE)
(async () => {
  console.log('--- 🚀 Починаємо тест BlogService ---');

  let newPostId: string | undefined;

  try {
    // --- 1. Тест CREATE ---
    console.log('\nСтворення нового поста...');
    const newPost = await blogService.createPost(
      {
        title: 'Мій Тестовий Пост',
        slug: `test-post-${Date.now()}`,
        excerpt: 'Це просто тест...',
        contentMw: '## Привіт',
        coverImageURL: 'http://example.com/img.png',
        locale: 'uk',
        states: 'draft',
        tags: ['test', 'typescript'],
        publishedAt: null,
      },
      'test-user-id' // опціональний userId
    );
    newPostId = newPost.id;
    console.log(`✅ Пост створено, ID: ${newPostId}`);

    // --- 2. Тест GET BY ID ---
    console.log('\nОтримання поста по ID...');
    const post = await blogService.getById(newPostId!);
    console.log(
      `✅ Пост отримано: ${post?.title} (статус: ${post?.states})`
    );

    // --- 3. Тест UPDATE (Publish) ---
    console.log('\nПублікація поста...');
    const publishedPost = await blogService.publish(newPostId!);
    console.log(
      `✅ Пост опубліковано, новий статус: ${publishedPost.states}, дата: ${publishedPost.publishedAt}`
    );

    // --- 4. Тест GET PUBLISHED ---
    console.log('\nОтримання всіх опублікованих...');
    const published = await blogService.getPublished('uk');
    const justPublished = published.find((p) => p.id === newPostId);
    console.log(
      `✅ Знайдено ${published.length} опублікованих. Наш пост у списку: ${
        !!justPublished
      }`
    );

    // --- 5. Тест GET BY SLUG ---
    console.log('\nОтримання по slug...');
    const postBySlug = await blogService.getBySlug(
      newPost.slug,
      newPost.locale
    );
    console.log(
      `✅ Знайдено по slug: ${postBySlug?.title} (ID: ${postBySlug?.id})`
    );
  } catch (error) {
    console.error('❌ Під час тесту сталася помилка:', error);
  } finally {
    // --- 6. Тест DELETE (Очистка) ---
    if (newPostId) {
      console.log(`\nВидалення тестового поста (ID: ${newPostId})...`);
      await blogService.delete(newPostId);

      // Перевірка видалення
      const deletedPost = await blogService.getById(newPostId);
      if (!deletedPost) {
        console.log('✅ Пост успішно видалено.');
      } else {
        console.error('❌ Помилка: Пост не було видалено.');
      }
    }
    console.log('--- 🏁 Тест завершено ---');
  }
})();
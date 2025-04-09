self.addEventListener('fetch', () => {
  // literally does nothing
});

//console.info('SW for test running');
// sw.js
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  // Pode abrir o app se quiser
  event.waitUntil(clients.openWindow('/'));
});

self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Lembrete';
  const options = {
      body: data.body || 'Você tem tarefas pendentes!',
      icon: '/icon.png'
  };

  event.waitUntil(
      self.registration.showNotification(title, options)
  );
});

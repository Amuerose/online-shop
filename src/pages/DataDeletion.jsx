export default function DataDeletion() {
  return (
    <div className="max-w-2xl mx-auto p-8 text-center text-brown-800">
      <h1 className="text-2xl font-bold mb-4">Удаление данных Facebook</h1>
      <p className="mb-2">
        Если вы хотите удалить свои данные, полученные через вход с помощью Facebook,
        пожалуйста, отправьте запрос на наш email:{" "}
        <a href="mailto:support@amuerose.cz" className="text-blue-600 underline">
          support@amuerose.cz
        </a>.
      </p>
      <p>
        Мы удалим все данные, связанные с вашей учетной записью, в течение 30 дней после получения запроса.
      </p>
    </div>
  );
}
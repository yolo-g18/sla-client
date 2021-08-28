const Loading = () => {
  return (
    <div>
      <link
        rel="stylesheet"
        href="https://pagecdn.io/lib/font-awesome/5.10.0-11/css/all.min.css"
        integrity="sha256-p9TTWD+813MlLaxMXMbTA7wN/ArzGyW/L7c5+KkjOkM="
        crossOrigin="anonymous"
      />

      <div className="w-full h-full fixed block  bg-white opacity-100 z-50">
        <span className="text-green-600 opacity-100 top-1/3 my-0 mx-auto block relative w-0 h-0">
          <i className="fas fa-circle-notch fa-spin fa-4x"></i>
        </span>
      </div>
    </div>
  );
};

export default Loading;

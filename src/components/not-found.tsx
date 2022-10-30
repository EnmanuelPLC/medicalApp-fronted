import React from "react";

export function NotFound(): React.ReactElement {
return (
    <div className="errorPage m-3">
      <h1><code>Error 404!</code></h1>
      <p>Pagina no encontrada en el servidor</p>
    </div>
  );
}

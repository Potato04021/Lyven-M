// =====================================================================
//  BASE DE DATOS DE CATÁLOGOS  (edita solo este archivo para agregar/quitar)
//
//  Cada catálogo tiene una clave (ej. "trabajos") y estos campos:
//    title : nombre que se muestra arriba en el visor
//    mode  : "drive"  → se muestra tu archivo de Google Drive dentro de la página
//            "images" → se muestran páginas-imagen guardadas en tu propio sitio
//                       (la opción MÁS protegida: el archivo original nunca se expone)
//
//  mode "drive"  →  driveId : el código largo del link de Drive
//                   (en https://drive.google.com/file/d/ESTE_CODIGO/view)
//  mode "images" →  pages   : lista de imágenes, en orden, ej. ["catalogos/trabajos/p1.jpg", ...]
//                   watermark: true/false  (marca de agua "lyven.zl" sobre las páginas)
//
//  El botón del inicio abre:  catalogo.html?c=<clave>
// =====================================================================
const CATALOGS = {
  trabajos: {
    title: "Catálogo de trabajos",
    mode: "drive",
    driveId: "14vAOkhgHipHmpV5y4K-Dj6zyqWylsEGW"
  },
  lecturas: {
    title: "Catálogo de lecturas",
    mode: "drive",
    driveId: "1gE64d9n8kCY5CE5K_YVuC_WJfwyu21EK"
  }

  // Ejemplo de catálogo con imágenes propias (sin Drive):
  // ,
  // premium: {
  //   title: "Catálogo premium",
  //   mode: "images",
  //   watermark: true,
  //   pages: ["catalogos/premium/p1.jpg", "catalogos/premium/p2.jpg"]
  // }
};

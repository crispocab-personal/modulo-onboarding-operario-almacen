/* =========================================================================
   Prototipo HTML · Módulo de onboarding · cliente logistica
   Reproduce la página «Prototipo» de Figma (ray88w68SZKdrZQslRJ7cI, 185:975).
   Sin módulos ni build: funciona abriendo index.html directamente.
   ========================================================================= */
(function () {
  'use strict';

  var A = 'assets/';
  var FOTO_CAMARA = {
    estanteria: A + 'camara-estanteria-pexels-7018662.jpg',
    carro: A + 'camara-carro-pexels-31266794.jpg',
    etiqueta: A + 'camara-etiqueta-prenda-pexels-7441481.jpg'
  };
  // Tiempos de Figma (decisiones-producto.md, 2026-10-04)
  var TIEMPO = { comprobando: 2000, lectura: 1600, acierto: 900 };
  var TR = {
    pantalla: 'smart:300',      // entre pantallas
    disolver: 'dissolve:300',
    abrir: 'dissolve:250',      // hojas, menú, diálogo y cámara
    dentroSmart: 'smart:200',   // X del aviso
    dentroDisolver: 'dissolve:200', // X de la cámara
    instantaneo: 'instant:0'
  };

  /* ---------------------------------------------------------------------
     Utilidades
     --------------------------------------------------------------------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function attrs(o) {
    var out = '';
    for (var k in o) if (o[k] !== undefined && o[k] !== null && o[k] !== false) out += ' ' + k + (o[k] === true ? '' : '="' + esc(o[k]) + '"');
    return out;
  }

  /* ---------------------------------------------------------------------
     Componentes del sistema (nombre = componente de Figma)
     --------------------------------------------------------------------- */
  function IconButton(o) {
    return '<button type="button" class="icon-button' + (o.claro ? ' icon-button--claro' : '') + '"' +
      attrs({ id: o.id, 'aria-label': o.label, 'data-go': o.go, 'data-tr': o.tr, 'data-nd': o.nd, 'data-figma': o.figma }) + '>' +
      '<img src="' + A + 'icon-24-' + o.icono + '.svg" alt="" width="24" height="24"></button>';
  }

  function Header(o) {
    if (o.modo === 'camara') {
      return '<div class="header header--camara" data-figma="Header · Cámara"><span class="header__espacio"></span>' +
        IconButton({ icono: 'close-blanco', label: 'Cerrar la cámara', go: o.cerrar, tr: TR.dentroDisolver, figma: 'Icon button · Acción derecha' }) + '</div>';
    }
    var practica = o.modo === 'practica';
    var tag = o.h1 ? 'h1' : 'p';
    var h = '<header class="header header--' + (practica ? 'practica' : 'normal') + '" data-figma="Header · ' + (practica ? 'Práctica' : 'Onboarding') + '">';
    if (o.volver) h += IconButton({ icono: practica ? 'arrow-left-blanco' : 'arrow-left', claro: !practica, label: 'Volver', go: o.volver, tr: TR.pantalla, figma: 'Icon button · Volver' });
    h += '<div class="header__titulo"><' + tag + ' class="header__texto t-label-l-bold"' + (o.h1 ? ' tabindex="-1" data-titulo' : '') + '>' + esc(o.titulo) + (o.lector ? '<span class="solo-lector">' + esc(o.lector) + '</span>' : '') + '</' + tag + '>' +
      (practica ? '<span class="etiqueta-practica t-label-s" data-figma="Etiqueta práctica">PRÁCTICA</span>' : '') + '</div>';
    // Acción derecha del onboarding: X = salir del onboarding. Abre la confirmación O3 sobre la pantalla actual (2026-10-06)
    if (o.salir) h += IconButton({ id: 'btn-salir-onboarding', icono: 'close', claro: true, label: 'Salir del onboarding', go: 'onboarding-o3', tr: TR.abrir, figma: 'Icon button · Salir del onboarding' });
    if (o.mas) {
      h += IconButton({ id: 'btn-mas', icono: practica ? 'more-blanco' : 'more', claro: !practica, label: 'Más opciones',
        go: o.mas === 'nd' ? null : o.mas, nd: o.mas === 'nd', tr: TR.abrir, figma: 'Icon button · Acción derecha' });
    }
    return h + '</header>';
  }

  function IndicadorDeProgreso(paso, bloque) {
    var t = '';
    for (var i = 1; i <= 5; i++) t += '<span class="indicador__tramo' + (i <= paso ? ' indicador__tramo--recorrido' : '') + '"></span>';
    return '<div class="indicador-de-progreso" data-figma="Indicador de progreso · Bloque ' + paso + '">' +
      '<div class="indicador__tramos" aria-hidden="true">' + t + '</div>' +
      '<p class="indicador__etiqueta t-label-s"><span>Bloque ' + paso + ' de 5 ·</span><span>' + esc(bloque) + '</span></p></div>';
  }

  function ButtonCTA(o) {
    return '<button type="button" class="button-cta button-cta--' + o.estilo + ' t-label-l"' +
      attrs({ id: o.id, 'aria-disabled': o.disabled ? 'true' : null, 'aria-describedby': o.disabled ? o.requisito : null, 'data-go': o.go, 'data-tr': o.tr, 'data-nd': o.nd, 'data-figma': 'Button CTA · ' + (o.figma || o.texto) }) + '>' +
      esc(o.texto) + '</button>';
  }

  function LinkButton(o) {
    return '<button type="button" class="link-button t-label-l"' + attrs({ 'data-nd': o.nd, 'data-go': o.go, 'data-figma': o.figma }) + '>' + esc(o.texto) + '</button>';
  }

  // text input (DNI). Vacío: etiqueta dentro como placeholder. Relleno: etiqueta arriba y valor.
  // Campos editables: la clase is-filled se actualiza al escribir (ver «Login · campos editables»).
  function TextInput(o) {
    var valor = o.valor || '';
    return '<div class="text-input text-input--dni' + (valor ? ' is-filled' : '') + '" data-figma="text input · DNI">' +
      '<div class="text-input__campo">' +
      '<label class="text-input__label" for="' + o.id + '">DNI</label>' +
      '<input class="text-input__valor" id="' + o.id + '" type="text" inputmode="numeric" maxlength="8" autocomplete="off" spellcheck="false" data-campo="' + o.campo + '"' +
      attrs({ value: valor, 'aria-describedby': o.id + '-ayuda' }) + '>' +
      '</div>' +
      '<p class="text-input__ayuda t-label-s-1280" id="' + o.id + '-ayuda"><img src="' + A + 'icon-16-circle-help.svg" alt="" width="16" height="16">Solo los 8 números, sin la letra.</p>' +
      '</div>';
  }

  // Ojo del password input: gris vacío / negro relleno; tachado (icon / 24 / eye-off) con la contraseña visible (2026-10-06)
  function ojoSrc(relleno, visible) {
    var f = 'icon-24-eye' + (visible ? '-off' : '') + (relleno ? '-relleno' : '') + '.svg';
    return (window.__ASSETS && window.__ASSETS[f]) || A + f; // en el archivo único, la imagen embebida
  }

  function PasswordInput(o) {
    var valor = o.valor || '';
    return '<div class="text-input password-input' + (valor ? ' is-filled' : '') + '" data-figma="password input · Contraseña">' +
      '<div class="text-input__campo">' +
      '<label class="text-input__label" for="clave">Contraseña</label>' +
      '<input class="text-input__valor" id="clave" type="password" autocomplete="off" spellcheck="false" data-campo="clave"' + attrs({ value: valor }) + '>' +
      '<button type="button" class="ver-ocultar" data-ver-clave aria-label="Mostrar contraseña" aria-pressed="false" aria-controls="clave" data-figma="Ver u ocultar"><img src="' + ojoSrc(!!valor, false) + '" alt="" width="24" height="24"></button>' +
      '</div></div>';
  }

  function EstadoDeFeedback(o) {
    var icono = o.sinIcono ? '' : o.cargando
      ? '<span class="indicador-de-carga estado-de-feedback__icono" data-figma="Indicador de carga · Comprobando la cámara"><img src="' + A + 'indicador-de-carga.svg" alt="" width="56" height="56"></span>'
      : '<img class="estado-de-feedback__icono" src="' + A + 'icon-80-check-estado.svg" alt="" width="56" height="56">';
    return '<div class="estado-de-feedback" data-figma="Estado de feedback · ' + esc(o.figma) + '">' + icono +
      '<div class="textos"><h1 class="' + (o.soloDescripcion ? 't-body-s c-n400' : 't-title-xs') + '" tabindex="-1" data-titulo>' + esc(o.titulo).replace(/\n/g, '<br>') + '</h1>' +
      (o.texto ? '<p class="t-body-s c-n400">' + esc(o.texto) + '</p>' : '') + '</div></div>';
  }

  function MensajeConsejo(etiqueta, texto, figma) {
    return '<div class="mensaje mensaje--consejo" role="note" data-figma="' + esc(figma) + '">' +
      '<img class="mensaje__icono" src="' + A + 'icon-24-info.svg" alt="" width="24" height="24">' +
      '<div class="mensaje__texto"><p class="t-label-s">' + esc(etiqueta) + '</p><p class="t-body-s">' + esc(texto) + '</p></div></div>';
  }

  function MensajeError(o) {
    // I4 · Sin role="alert" al pintar la capa: el error va en el título que recibe el foco y en la descripción de la capa
    return '<div class="mensaje mensaje--error" data-figma="' + esc(o.figma) + '">' +
      '<div class="mensaje__contenido"><img class="mensaje__icono" src="' + A + 'icon-24-error.svg" alt="" width="24" height="24">' +
      '<div class="mensaje__texto" id="mensaje-error"><p class="t-label-s">ERROR</p><p class="t-body-s">' + esc(o.texto) + '</p></div></div>' +
      IconButton({ icono: 'close', label: 'Cerrar aviso', go: o.cerrar, tr: TR.dentroSmart, figma: 'Icon button · Cerrar aviso' }) + '</div>';
  }

  // Destacado: icono de 40 en un cuadro de 56 (Neutral 100) y el valor, sobre Neutral 200 (2026-10-06)
  function Destacado(icono, valor) {
    return '<li class="destacado" data-figma="Destacado · ' + esc(valor) + '"><span class="destacado__icono">' +
      '<img src="' + A + 'icon-40-' + icono + '.svg" alt="" width="40" height="40"></span>' +
      '<span class="t-title-xxxs">' + esc(valor) + '</span></li>';
  }

  function BloqueDeDatos(etiqueta, valor, apunte, figma) {
    return '<div class="bloque-de-datos" data-figma="Bloque de datos · ' + esc(figma) + '">' +
      '<p class="t-label-s c-n400">' + esc(etiqueta) + '</p><p class="t-title-xs">' + esc(valor) + '</p>' +
      (apunte ? '<p class="t-label-l c-n400">' + esc(apunte) + '</p>' : '') + '</div>';
  }

  function Scanner(estado, o) {
    o = o || {};
    var inner = '<i class="esquina esquina--si"></i><i class="esquina esquina--sd"></i><i class="esquina esquina--ii"></i><i class="esquina esquina--id"></i>' +
      (estado === 'acierto' ? '<img class="scanner__check" src="' + A + 'icon-80-check-acierto.svg" alt="" width="96" height="96">' : '<i class="scanner__linea"></i>');
    var cls = 'scanner scanner--' + estado + (o.visor ? ' scanner--visor' : '');
    if (o.go) {
      return '<button type="button" class="' + cls + '"' + attrs({ 'aria-label': o.label, 'data-go': o.go, 'data-tr': o.tr, 'data-figma': 'Scanner' }) + '>' + inner + '</button>';
    }
    return '<div class="' + cls + '" aria-hidden="true" data-figma="Scanner">' + inner + '</div>';
  }

  function Ilustracion(tipo) {
    if (tipo === 'posicion') {
      return '<div class="ilustracion ilustracion--posicion" data-figma="Ilustración · Etiqueta de posición"><div class="ilustracion__etiqueta">' +
        '<span class="ilustracion__union"><img src="' + A + 'ilustracion-etiqueta-posicion-union.svg" alt="" width="189" height="51"></span></div></div>';
    }
    return '<div class="ilustracion ilustracion--carro" data-figma="Ilustración · Carro de paquetería"><img src="' + A + 'ilustracion-carro.svg" alt="" width="224" height="224"></div>';
  }

  function InstruccionDeEscaneo(tipo, texto, figma) {
    return '<div class="instruccion-de-escaneo' + (tipo === 'carro' ? ' instruccion-de-escaneo--centrada' : '') + '" data-figma="Instrucción de escaneo · ' + esc(figma) + '">' +
      '<div class="visor">' + Ilustracion(tipo) + Scanner('reposo') + '</div>' +
      '<p class="instruccion__texto t-body-s">' + esc(texto) + '</p></div>';
  }

  function celdaAltura(loc, conTitulo) {
    var color = 'var(--altura-' + loc.altura.toLowerCase() + ')';
    return '<div class="location-cell location-cell--altura" style="--altura:' + color + '" data-altura="' + esc(loc.altura) + '" data-figma="Location cell / Altura">' +
      (conTitulo ? '<span class="t-label-s">ALTURA</span>' : '') + '<span class="t-title-xs">' + esc(loc.altura) + '</span></div>';
  }
  function celdaPosicion(loc, conTitulo) {
    return '<div class="location-cell location-cell--' + (loc.par ? 'par' : 'impar') + '" data-figma="Location cell / Posición">' +
      (conTitulo ? '<span class="t-label-s">POSICIÓN</span>' : '') + '<span class="t-title-xs">' + esc(loc.pos) + '</span></div>';
  }
  function Location(loc) {
    return '<div class="location" data-figma="Location · Posición destino">' +
      '<div class="location__pasillo"><span class="t-label-s">PASILLO</span><span class="t-title-xs">' + esc(loc.pasillo) + '</span></div>' +
      '<div class="location__fila">' + celdaAltura(loc, true) + celdaPosicion(loc, true) + '</div></div>';
  }
  function LocationBar(loc, figma) {
    return '<div class="location-bar" role="group" aria-label="Pasillo ' + esc(loc.pasillo) + ', altura ' + esc(loc.altura) + ', posición ' + esc(loc.pos) + '" data-figma="Location bar · ' + esc(figma) + '">' +
      '<div class="location-bar__pasillo"><span class="t-title-xs">' + esc(loc.pasillo) + '</span></div>' +
      celdaAltura(loc, false) + celdaPosicion(loc, false) + '</div>';
  }

  function udsLector(uds) {
    var u = uds.split('/');
    return u[0] + ' de ' + u[1] + (u[1] === '1' ? ' unidad' : ' unidades');
  }
  function TarjetaDeArticulo(art, uds) {
    return '<div class="tarjeta-de-articulo" data-figma="Tarjeta de artículo · ' + esc(art.nombre) + '">' +
      '<div class="tarjeta__foto"><img src="' + A + art.foto + '" alt="' + esc(art.nombre) + '">' +
      '<span class="tarjeta__referencia t-label-s-1280">' + esc(art.ref) + '</span></div>' +
      '<div class="tarjeta__talla-uds">' +
      '<span class="dato"><span aria-hidden="true" class="t-title-s">' + esc(art.talla) + '</span><span aria-hidden="true" class="dato__unidad t-label-s">TALLA</span><span class="solo-lector">talla ' + esc(art.talla) + '</span></span>' +
      '<span class="dato" data-uds><span aria-hidden="true" class="t-title-s">' + esc(uds) + '</span><span aria-hidden="true" class="dato__unidad t-label-s">UDS</span><span class="solo-lector">' + udsLector(uds) + '</span></span>' +
      '</div></div>';
  }
  function TarjetaDeArticuloCompacta(art, uds) {
    return '<div class="tarjeta-de-articulo tarjeta-de-articulo--compacta" data-figma="Tarjeta de artículo · ' + esc(art.nombre) + ' (compacta)">' +
      '<img class="tarjeta-compacta__foto" src="' + A + art.foto + '" alt="' + esc(art.nombre) + '" width="39" height="56">' +
      '<div class="tarjeta-compacta__slot"><div class="tarjeta-compacta__datos">' +
      '<span class="t-label-s-1280 c-n400">' + esc(art.ref) + '</span>' +
      '<span class="dato"><span aria-hidden="true" class="t-title-xs">' + esc(art.talla) + '</span><span aria-hidden="true" class="dato__unidad t-label-s">TALLA</span><span class="solo-lector">talla ' + esc(art.talla) + '</span></span></div>' +
      '<span class="dato" data-uds><span aria-hidden="true" class="t-title-xs">' + esc(uds) + '</span><span aria-hidden="true" class="dato__unidad t-label-s">UDS</span><span class="solo-lector">' + udsLector(uds) + '</span></span>' +
      '</div></div>';
  }

  function DisparadorDeEscaneo(go) {
    return '<button type="button" class="disparador-de-escaneo t-label-l" id="btn-escanear" data-go="' + go + '" data-tr="' + TR.abrir + '" data-figma="Disparador de escaneo">' +
      '<img src="' + A + 'icon-24-scan.svg" alt="" width="16" height="16">Pulsa para escanear</button>';
  }

  function HojaModal(o) {
    return '<div class="overlay" data-figma="Overlay · Fondo"' + attrs({ 'data-go': o.velo, 'data-tr': o.velo ? TR.abrir : null }) + '></div>' +
      '<div class="hoja-modal' + (o.sinHueco ? ' hoja-modal--sin-hueco' : '') + '" data-figma="Hoja modal · ' + esc(o.figma) + '">' +
      '<div class="hoja-modal__textos"><div class="hoja-modal__barra">' +
      '<h2 class="hoja-modal__titulo t-title-xxs" id="capa-titulo" tabindex="-1">' + esc(o.titulo) + '</h2>' +
      IconButton({ icono: 'close', claro: true, label: 'Cerrar', go: o.cerrar, tr: o.trCerrar, figma: 'Icon button · Cerrar' }) + '</div>' +
      '<p class="t-body-s c-n400" id="capa-texto">' + esc(o.texto) + '</p></div>' +
      (o.contenido ? '<div class="hoja-modal__contenido">' + o.contenido + '</div>' : '') +
      '<div class="hoja-modal__acciones">' + o.acciones + '</div></div>';
  }

  /* ---------------------------------------------------------------------
     Pantallas
     --------------------------------------------------------------------- */
  var SCREENS = {};
  var ORDEN = [];
  function def(id, nombre, grupo, o) {
    o.id = id; o.nombre = nombre; o.grupo = grupo;
    SCREENS[id] = o; ORDEN.push(id);
  }

  // ---- Login ----
  // Campos editables: lo que se escribe se guarda en LOGIN y se mantiene al abrir y cerrar la hoja.
  // Las pantallas «/ rellenado» de Figma muestran el ejemplo (DNI 48203917).
  var EJEMPLO = { dni: '48203917', clave: 'xxxxxxxx', dniHoja: '48203917' };
  var LOGIN = { dni: '', clave: '', dniHoja: '' };
  function loginCompleto(v) { return /^\d{8}$/.test(v.dni) && v.clave.length > 0; }
  function pantallaLogin(relleno) {
    var v = relleno ? EJEMPLO : LOGIN, ok = loginCompleto(v);
    return '<div class="pantalla" data-figma="01 · Iniciar sesión">' +
      '<div class="contenido contenido--login">' +
      '<div class="saludo"><h1 class="t-title-xs" tabindex="-1" data-titulo>Buenos días,<br>Marta</h1>' +
      '<img class="avatar avatar--foto" src="' + A + 'avatar-foto-freepik-12445468.jpg" alt="" width="64" height="64" data-figma="Avatar · Tipo=Foto"></div>' +
      '<div class="campos">' +
      TextInput({ id: 'dni', campo: 'dni', valor: v.dni }) +
      '<div class="contrasena">' + PasswordInput({ valor: v.clave }) +
      LinkButton({ texto: 'He olvidado mi contraseña', nd: true, figma: 'Link button · Clave olvidada' }) + '</div>' +
      '</div></div>' +
      '<div class="acciones">' +
      ButtonCTA({ id: 'btn-no-puedo-entrar', texto: 'No puedo entrar', estilo: 'outlined', go: '02-pedir-dni', tr: TR.disolver }) +
      '<span class="solo-lector" id="requisito-entrar">Se activa al escribir los 8 números del DNI y la contraseña.</span>' +
      ButtonCTA({ id: 'btn-entrar', texto: 'Entrar', estilo: 'brand-dark', disabled: !ok, requisito: 'requisito-entrar', go: '03-bienvenida', tr: TR.disolver }) +
      '</div></div>';
  }
  function hojaNoPuedoEntrar(relleno) {
    var v = relleno ? EJEMPLO : LOGIN;
    return HojaModal({
      figma: 'No has podido entrar',
      titulo: 'No te preocupes, avisamos a tu responsable',
      texto: 'Le diremos que no has podido entrar para que gestione tu cuenta. Podrás seguir con la formación igualmente.',
      cerrar: '01-iniciar-sesion', trCerrar: TR.disolver,
      contenido: '<span class="solo-lector" id="requisito-avisar">Se activa al escribir los 8 números del DNI.</span>' + TextInput({ id: 'dni-hoja', campo: 'dniHoja', valor: v.dniHoja }),
      // «Volver a intentarlo» en Outlined (secundaria), por decisión del usuario (2026-10-05)
      acciones: ButtonCTA({ texto: 'Volver a intentarlo', figma: 'Acción secundaria', estilo: 'outlined', go: '01-iniciar-sesion', tr: TR.disolver }) +
        ButtonCTA({ id: 'btn-avisar', texto: 'Avisar y continuar', figma: 'Acción principal', estilo: 'brand-dark', disabled: !/^\d{8}$/.test(v.dniHoja), requisito: 'requisito-avisar', go: '02-ya-avisado', tr: TR.disolver })
    });
  }

  def('01-iniciar-sesion', '01 · Iniciar sesión', 'Inicio de sesión', { html: function () { return pantallaLogin(false); } });
  def('01-iniciar-sesion-rellenado', '01 · Iniciar sesión / rellenado', 'Inicio de sesión', { html: function () { return pantallaLogin(true); } });
  def('02-pedir-dni', '02 · No has podido entrar / pedir DNI', 'Inicio de sesión', {
    html: function () { return pantallaLogin(false); }, capa: function () { return hojaNoPuedoEntrar(false); },
    base: '01-iniciar-sesion', opener: '#btn-no-puedo-entrar', escape: '01-iniciar-sesion', escapeTr: TR.disolver
  });
  def('02-pedir-dni-rellenado', '02 · No has podido entrar / pedir DNI / rellenado', 'Inicio de sesión', {
    html: function () { return pantallaLogin(false); }, capa: function () { return hojaNoPuedoEntrar(true); },
    base: '01-iniciar-sesion', opener: '#btn-no-puedo-entrar', escape: '01-iniciar-sesion', escapeTr: TR.disolver
  });
  def('02-ya-avisado', '02 · No has podido entrar / ya avisado', 'Inicio de sesión', {
    html: function () {
      return '<div class="pantalla"><div class="contenido contenido--centrado">' +
        EstadoDeFeedback({ figma: 'Ya hemos avisado', titulo: 'Ya hemos avisado', texto: 'Tu responsable se pondrá en breve en contacto contigo.' }) +
        '</div><div class="acciones">' + ButtonCTA({ texto: 'Continuar con la formación', estilo: 'brand-dark', go: '03-bienvenida', tr: TR.pantalla }) + '</div></div>';
    }
  });

  // ---- Bloques ----
  function pantallaBloque(o) {
    return '<div class="pantalla">' + Header({ modo: 'normal', titulo: 'ONBOARDING', volver: o.volver, salir: true }) +
      IndicadorDeProgreso(o.paso, o.bloque) +
      '<div class="contenido' + (o.centrado ? ' contenido--centrado' : '') + '">' + o.contenido + '</div>' +
      '<div class="acciones' + (o.acciones ? '' : ' acciones--vacias') + '">' + (o.acciones || '') + '</div></div>';
  }
  function textos(titulo, cuerpo) {
    return '<div class="textos"><h1 class="t-title-xs" tabindex="-1" data-titulo>' + esc(titulo) + '</h1>' +
      (cuerpo ? '<p class="t-body-s c-n400">' + esc(cuerpo) + '</p>' : '') + '</div>';
  }
  function siguiente(go, texto) { return ButtonCTA({ texto: texto || 'Siguiente', estilo: 'brand-dark', go: go, tr: TR.pantalla }); }

  def('03-bienvenida', '03 · Bienvenida', 'Bloque 1 · Introducción', {
    html: function () {
      return pantallaBloque({ paso: 1, bloque: 'Introducción',
        contenido: '<div class="textos"><h1 class="t-title-xs" tabindex="-1" data-titulo>Vamos a prepararte para tu primer día</h1>' +
          '<p class="t-body-s c-n400">Vas a iniciar una formación corta que podrás parar y seguir cuando quieras. Estos son los puntos que vas a tocar:</p>' +
          '<ul class="lista-puntos t-body-s"><li>Conoce tu herramienta</li><li>Seguridad</li><li>Práctica de picking</li></ul></div>',
        acciones: siguiente('04-tu-herramienta-de-trabajo', 'Empezar') });
    }
  });
  def('04-tu-herramienta-de-trabajo', '04 · Tu herramienta de trabajo', 'Bloque 2 · Herramienta', {
    html: function () {
      return pantallaBloque({ paso: 2, bloque: 'Herramienta', volver: '03-bienvenida',
        contenido: textos('Este móvil es tu herramienta de trabajo', 'Con él lees los códigos y recibes las tareas. Puedes usarlo con los guantes puestos.') +
          MensajeConsejo('CONSEJO', 'Párate antes de leer un código. No leas en movimiento.', 'Mensaje · Consejo'),
        acciones: siguiente('05-comprobando') });
    }
  });
  def('05-comprobando', '05 · La cámara está lista / comprobando', 'Bloque 2 · Herramienta', {
    html: function () {
      return pantallaBloque({ paso: 2, bloque: 'Herramienta', volver: '04-tu-herramienta-de-trabajo', centrado: true,
        contenido: EstadoDeFeedback({ figma: 'Comprobando', cargando: true, soloDescripcion: true, titulo: 'Comprobando permisos\nde la cámara' }) });
    },
    auto: { ms: TIEMPO.comprobando, to: '05-comprobada', tr: TR.pantalla }, anuncio: 'Comprobando…'
  });
  def('05-comprobada', '05 · La cámara está lista / comprobada', 'Bloque 2 · Herramienta', {
    html: function () {
      return pantallaBloque({ paso: 2, bloque: 'Herramienta', volver: '04-tu-herramienta-de-trabajo', centrado: true,
        contenido: EstadoDeFeedback({ figma: 'Cámara lista', titulo: 'La cámara está lista', texto: 'Hemos comprobado que puedes leer códigos con este móvil.' }),
        acciones: siguiente('06-zona-de-carretillas') });
    }
  });
  def('06-zona-de-carretillas', '06 · Zona de carretillas', 'Bloque 3 · Seguridad', {
    html: function () {
      return pantallaBloque({ paso: 3, bloque: 'Seguridad', volver: '05-comprobada',
        contenido: textos('Zona de tránsito de carretillas', 'Transita solo por los pasillos marcados. No cruces por donde circulan las carretillas.') +
          '<div class="plano" data-figma="FALTA · Plano de zonas de tránsito · falta"><img src="' + A + 'plano-zonas-transito.png" alt="Suelo del almacén con las marcas de tránsito: una línea amarilla y otra doble, amarilla y roja, delimitan el pasillo por el que se camina; junto a una columna hay dos bolardos amarillos y negros y, detrás, cuadrículas rojas con aspas pintadas en el suelo." width="641" height="477"></div>',
        acciones: siguiente('07-equipo-de-proteccion') });
    }
  });
  def('07-equipo-de-proteccion', '07 · Equipo de protección', 'Bloque 3 · Seguridad', {
    html: function () {
      return pantallaBloque({ paso: 3, bloque: 'Seguridad', volver: '06-zona-de-carretillas',
        contenido: '<div class="textos"><h1 class="t-title-xs" tabindex="-1" data-titulo>Recuerda que debes usar</h1></div>' +
          '<ul class="lista-epi" data-figma="EPI">' + Destacado('vest', 'Chaleco reflectante') + Destacado('safety-boot', 'Calzado de seguridad') + Destacado('gloves', 'Guantes de manipulación') + '</ul>',
        acciones: ButtonCTA({ texto: 'He leído y entendido las normas', estilo: 'brand-dark', go: '08-antes-de-empezar', tr: TR.pantalla }) });
    }
  });
  def('08-antes-de-empezar', '08 · Antes de empezar', 'Bloque 4 · Práctica', {
    html: function () {
      return pantallaBloque({ paso: 4, bloque: 'Práctica', volver: '07-equipo-de-proteccion',
        contenido: textos('Vamos a practicar', 'Vas a recoger un pedido de prueba: 3 artículos en 2 posiciones. Son productos reales del almacén.') +
          MensajeConsejo('SOLO PARA TI', 'Este resultado solo lo ves tú. Si te equivocas, la app te avisa igual que en el trabajo real.', 'Mensaje · Solo para ti'),
        acciones: siguiente('09-tu-dia-de-hoy') });
    }
  });
  def('09-tu-dia-de-hoy', '09 · Tu día de hoy', 'Bloque 4 · Práctica', {
    html: function () {
      return pantallaBloque({ paso: 4, bloque: 'Práctica', volver: '08-antes-de-empezar',
        contenido: '<div class="datos"><h1 class="t-title-xs" tabindex="-1" data-titulo>Tu día de hoy</h1>' +
          BloqueDeDatos('TU PUESTO', 'Operaria de picking', 'Sector F · 0A', 'Tu puesto') +
          BloqueDeDatos('A QUIÉN ACUDIR', 'Javier Soler', 'Jefe de equipo', 'A quién acudir') +
          BloqueDeDatos('TU TURNO DE HOY', 'Mañana · 6:00 – 14:00', 'Descanso de 30 minutos a las 10:00', 'Tu turno de hoy') + '</div>',
        acciones: siguiente('picking-01', 'Empezar la práctica') });
    }
  });

  // ---- Picking ----
  var LOC_A = { pasillo: '143', altura: 'A', pos: '128', par: true };
  var LOC_C = { pasillo: '143', altura: 'C', pos: '143', par: false };
  var ART = {
    camiseta: { nombre: 'Camiseta raglán', ref: '0/3296/152/600/04', talla: 'M', foto: '03296152600-a4o.jpg' },
    polo: { nombre: 'Polo', ref: '0/2829/097/902/03', talla: 'S', foto: '02829097902-a4o.jpg' },
    pantalon: { nombre: 'Pantalón', ref: '0/4075/255/800/40', talla: '38', foto: '04075255800-a4o.jpg' }
  };
  var PASOS = [
    { n: '01', nombre: 'Picking 01 · Posición más cercana', titulo: 'PICKING', volver: '09-tu-dia-de-hoy', foto: 'estanteria', tipo: 'zona', refTexto: 'Posición del Sector F · 0A' },
    { n: '02', nombre: 'Picking 02 · Carro de paquetería', titulo: 'PICKING', volver: 'picking-01', foto: 'carro', tipo: 'carro', refTexto: 'Carro de paquetería' },
    { n: '03', nombre: 'Picking 03 · Escanear posición (143 · A · 128)', titulo: 'ESCANEAR POSICIÓN', mas: 'nd', foto: 'estanteria', tipo: 'posicion', loc: LOC_A },
    { n: '04', nombre: 'Picking 04 · Escanear SKU · Camiseta', titulo: 'ESCANEAR SKU', mas: 'picking-o1', foto: 'etiqueta', tipo: 'sku', loc: LOC_A, art: ART.camiseta, uds: '0/1', udsOk: '1/1' },
    { n: '05', nombre: 'Picking 05 · Escanear SKU · Polo (misma posición)', titulo: 'ESCANEAR SKU', mas: 'nd', foto: 'etiqueta', tipo: 'sku', loc: LOC_A, art: ART.polo, uds: '0/1', udsOk: '1/1' },
    { n: '06', nombre: 'Picking 06 · Escanear posición (143 · C · 143)', titulo: 'ESCANEAR POSICIÓN', mas: 'nd', foto: 'estanteria', tipo: 'posicion', loc: LOC_C },
    { n: '07-0de2', nombre: 'Picking 07 · Escanear SKU · Pantalón (0 de 2)', titulo: 'ESCANEAR SKU', mas: 'nd', foto: 'etiqueta', tipo: 'sku', loc: LOC_C, art: ART.pantalon, uds: '0/2', udsOk: '1/2', anuncioOk: 'Leído. 1 de 2 unidades.' },
    { n: '07-1de2', nombre: 'Picking 07 · Escanear SKU · Pantalón (1 de 2)', titulo: 'ESCANEAR SKU', mas: 'nd', foto: 'etiqueta', tipo: 'sku', loc: LOC_C, art: ART.pantalon, uds: '1/2', udsOk: '2/2', anuncioOk: 'Leído. 2 de 2 unidades.' }
  ];
  PASOS.forEach(function (p) { p.id = 'picking-' + p.n; });
  PASOS.forEach(function (p, i) { p.sig = PASOS[i + 1] ? PASOS[i + 1].id : 'picking-08'; });
  var PASO = {}; PASOS.forEach(function (p) { PASO[p.n] = p; });

  // I3 · Complemento del título para lector de pantalla: qué hay que hacer y con qué datos
  function lectorPaso(p) {
    if (p.tipo === 'zona') return ': escanea la posición más cercana a tu ubicación. Tu zona hoy: Sector F · 0A.';
    if (p.tipo === 'carro') return ': escanea el código de un carro de paquetería.';
    var loc = 'pasillo ' + p.loc.pasillo + ', altura ' + p.loc.altura + ', posición ' + p.loc.pos;
    if (p.tipo === 'posicion') return ': ' + loc + '.';
    var u = p.uds.split('/');
    return ': ' + p.art.nombre.toLowerCase() + ', talla ' + p.art.talla + ', ' + u[0] + ' de ' + u[1] + (u[1] === '1' ? ' unidad' : ' unidades') + '. ' + loc + '.';
  }

  function pantallaPaso(p) {
    var h = '<div class="pantalla" data-figma="' + esc(p.nombre) + '">' + Header({ modo: 'practica', titulo: p.titulo, volver: p.volver, mas: p.mas, h1: true, lector: lectorPaso(p) });
    if (p.tipo === 'zona') {
      h += '<div class="contenido-paso contenido-paso--zona">' + BloqueDeDatos('TU ZONA HOY', 'Sector F · 0A', null, 'Tu zona hoy') +
        InstruccionDeEscaneo('posicion', 'Escanea la posición más cercana a tu ubicación', 'Posición más cercana') + '</div>';
    } else if (p.tipo === 'carro') {
      h += '<div class="contenido-paso contenido-paso--centro">' + InstruccionDeEscaneo('carro', 'Escanea el código de un carro de paquetería', 'Carro') + '</div>';
    } else if (p.tipo === 'posicion') {
      h += '<div class="contenido-paso contenido-paso--posicion">' + Location(p.loc) + '<p class="instruccion__texto t-body-s">Dirígete al pasillo y escanea esta posición</p></div>';
    } else {
      h += LocationBar(p.loc, 'Ubicación actual') + '<div class="contenido-paso">' + TarjetaDeArticulo(p.art, p.uds) + '</div>';
    }
    return h + DisparadorDeEscaneo(p.id + '-lectura') + '</div>';
  }

  function Referencia(p, uds) {
    if (p.refTexto) return '<div class="referencia referencia--texto t-module-title" data-figma="Referencia">' + esc(p.refTexto) + '</div>';
    return '<div class="referencia" data-figma="Referencia">' + LocationBar(p.loc, 'Referencia') + (p.art ? TarjetaDeArticuloCompacta(p.art, uds) : '') + '</div>';
  }

  // Lectura con cámara: estado = camara | acierto | error
  function capaCamara(p, estado, o) {
    o = o || {};
    var uds = estado === 'acierto' ? p.udsOk : p.uds;
    var scanner;
    if (estado === 'camara') scanner = Scanner('camara', { visor: true, go: p.id + '-acierto', tr: 'smart:200', label: 'Simular lectura' });
    else if (estado === 'error') scanner = Scanner('error', { visor: true, go: o.siguiente, tr: TR.instantaneo, label: 'Simular otra lectura' });
    else scanner = avanceAuto ? Scanner('acierto', { visor: true })
      : Scanner('acierto', { visor: true, go: p.sig, tr: TR.pantalla, label: 'Continuar al siguiente paso' });
    var titulo = estado === 'acierto' ? 'Lectura con cámara: lectura correcta'
      : estado === 'error' ? 'Lectura con cámara: error. ' + o.textoError : 'Lectura con cámara';
    return '<div class="camara" data-figma="Imagen de cámara">' +
      '<img class="camara__imagen" src="' + FOTO_CAMARA[p.foto] + '" alt="">' +
      '<div class="atenuado" aria-hidden="true" data-figma="Atenuado"><span class="atenuado__banda atenuado__banda--sup"></span><span class="atenuado__banda atenuado__banda--inf"></span><span class="atenuado__banda atenuado__banda--izq"></span><span class="atenuado__banda atenuado__banda--der"></span></div>' +
      '<div class="camara__columna">' +
      '<h2 class="solo-lector" id="capa-titulo" tabindex="-1">' + esc(titulo) + '</h2>' +
      '<div class="camara__superior" data-figma="Superior">' + Header({ modo: 'camara', cerrar: p.id }) + Referencia(p, uds) + '</div>' +
      '<div class="camara__zona-visor">' + scanner + '</div>' + (o.error || '') + '</div></div>';
  }

  PASOS.forEach(function (p) {
    def(p.id, p.nombre, 'Picking sin errores', { html: function () { return pantallaPaso(p); } });
    def(p.id + '-lectura', p.nombre + ' / lectura', 'Picking sin errores', {
      html: function () { return pantallaPaso(p); }, capa: function () { return capaCamara(p, 'camara'); },
      base: p.id, opener: '#btn-escanear', escape: p.id, escapeTr: TR.dentroDisolver, automatica: true,
      auto: { ms: TIEMPO.lectura, to: p.id + '-acierto', tr: 'smart:200' }
    });
    def(p.id + '-acierto', p.nombre + ' / acierto', 'Picking sin errores', {
      html: function () { return pantallaPaso(p); }, capa: function () { return capaCamara(p, 'acierto'); },
      base: p.id, opener: '#btn-escanear', escape: p.id, escapeTr: TR.dentroDisolver, automatica: true, pitido: true,
      anuncio: p.anuncioOk || 'Leído.', confirmacion: p.anuncioOk || 'Leído.',
      auto: { ms: TIEMPO.acierto, to: p.sig, tr: TR.pantalla }
    });
  });

  def('picking-08', 'Picking 08 · Tarea completada', 'Picking sin errores', {
    html: function () {
      return '<div class="pantalla">' + Header({ modo: 'practica', titulo: 'PICKING', h1: false }) +
        '<div class="contenido contenido--centrado" style="padding:0 16px">' +
        EstadoDeFeedback({ figma: 'Tarea completada', titulo: 'Tarea completada', texto: 'Déjalo en el parking que corresponda' }) + '</div>' +
        '<div class="acciones">' + ButtonCTA({ texto: 'Entendido', estilo: 'brand-dark', go: '10-donde-encontrarlo-despues', tr: TR.pantalla }) + '</div></div>';
    }
  });

  def('10-donde-encontrarlo-despues', '10 · Dónde encontrarlo después', 'Bloque 5 · Cierre', {
    html: function () {
      return pantallaBloque({ paso: 5, bloque: 'Cierre', centrado: true,
        contenido: EstadoDeFeedback({ figma: 'Has terminado tu formación', sinIcono: true, titulo: '¡Felicidades, Marta!\nHas terminado tu formación', texto: 'Avisa a tu responsable para continuar con tu siguiente tarea.' }) +
          BloqueDeDatos('A QUIÉN ACUDIR', 'Javier Soler', 'Jefe de equipo', 'A quién acudir'),
        acciones: ButtonCTA({ texto: 'Terminar', estilo: 'brand-dark', go: '01-iniciar-sesion', tr: TR.disolver }) });
    }
  });

  // ---- Errores E1–E9 ----
  var ERRORES = [
    ['e1', 'Picking E1 · Posición más cercana / error · código no válido', '01', 'Código no válido. Escanea una posición.'],
    ['e2', 'Picking E2 · Carro / error · tipo de contenedor', '02', 'No has escaneado el contenedor que se indica.'],
    ['e3', 'Picking E3 · Carro / error · contenedor en uso', '02', 'El contenedor ya está en uso en otro picking.'],
    ['e4', 'Picking E4 · Carro / error · código no válido', '02', 'Código no válido. Escanea un contenedor.'],
    ['e5', 'Picking E5 · Posición / error · posición no indicada', '03', 'No has escaneado la posición indicada.'],
    ['e6', 'Picking E6 · Posición / error · código no válido', '03', 'Código no válido. Escanea una posición.'],
    ['e7', 'Picking E7 · Artículo / error · artículo no indicado', '04', 'No has escaneado el artículo que se indica.'],
    ['e8', 'Picking E8 · Artículo / error · código no válido', '04', 'Código no válido. Escanea un artículo.'],
    ['e9', 'Picking E9 · General / error · conexión', '04', 'Error de conexión, vuelve a intentarlo.']
  ];
  ERRORES.forEach(function (e, i) {
    var p = PASO[e[2]];
    var siguienteId = ERRORES[i + 1] ? 'picking-' + ERRORES[i + 1][0] : 'picking-o1';
    def('picking-' + e[0], e[1], 'Errores E1–E9', {
      html: function () { return pantallaPaso(p); },
      capa: function () {
        return capaCamara(p, 'error', { siguiente: siguienteId, textoError: e[3],
          error: MensajeError({ texto: e[3], cerrar: p.id + '-lectura', figma: e[0] === 'e9' ? 'Mensaje · Error de conexión' : 'Mensaje · Error de lectura' }) });
      },
      base: p.id, opener: '#btn-escanear', escape: p.id, escapeTr: TR.dentroDisolver, vibrar: true, error: true
    });
  });

  // ---- Opciones O1–O2 (sobre Picking 04); O3, más abajo ----
  def('picking-o1', 'Picking O1 · Escanear SKU / menú', 'Opciones O1–O3', {
    html: function () { return pantallaPaso(PASO['04']); },
    capa: function () {
      return '<div class="overlay" data-figma="Overlay · Fondo" data-go="picking-04" data-tr="' + TR.abrir + '"></div>' +
        '<h2 class="solo-lector" id="capa-titulo" tabindex="-1">Más opciones</h2>' +
        '<div class="hoja-de-opciones" data-figma="Hoja de opciones · Menú">' +
        '<button type="button" class="opcion-de-menu t-body-s" data-go="picking-04" data-tr="' + TR.abrir + '" data-figma="Opción de menú · Marcar incidencia">Marcar incidencia</button>' +
        '<button type="button" class="opcion-de-menu t-body-s" data-go="picking-o2" data-tr="' + TR.abrir + '" data-figma="Opción de menú · Salir de la práctica">Salir de la práctica</button>' +
        '</div>';
    },
    base: 'picking-04', opener: '#btn-mas', escape: 'picking-04', escapeTr: TR.abrir, foco: '.opcion-de-menu'
  });
  def('picking-o2', 'Picking O2 · Escanear SKU / salir', 'Opciones O1–O3', {
    html: function () { return pantallaPaso(PASO['04']); },
    capa: function () {
      return HojaModal({ figma: 'Salir de la práctica', sinHueco: true, titulo: '¿Salir de la práctica?',
        texto: 'Si sales, perderás el progreso de esta práctica.', cerrar: 'picking-04', trCerrar: TR.abrir,
        acciones: ButtonCTA({ texto: 'Salir y perder el progreso', figma: 'Acción secundaria', estilo: 'outlined', go: '09-tu-dia-de-hoy', tr: TR.abrir }) +
          ButtonCTA({ id: 'btn-seguir', texto: 'Seguir practicando', figma: 'Acción principal', estilo: 'brand-dark', go: 'picking-04', tr: TR.abrir }) });
    },
    base: 'picking-04', opener: '#btn-mas', escape: 'picking-04', escapeTr: TR.abrir, foco: '#btn-seguir', dialogo: true
  });

  // ---- Opción O3 · Salir del onboarding (sobre la pantalla del onboarding desde la que se abre) ----
  // Misma lógica que O2. Una sola pantalla: se pinta sobre ORIGEN_O3, y «Seguir», la X y Escape vuelven a ella.
  var ORIGEN_O3 = '04-tu-herramienta-de-trabajo';
  def('onboarding-o3', 'Onboarding O3 · Salir del onboarding', 'Opciones O1–O3', {
    html: function () { return SCREENS[ORIGEN_O3].html(); },
    capa: function () {
      return HojaModal({ figma: 'Salir del onboarding', sinHueco: true, titulo: '¿Salir de la formación?',
        texto: 'Si sales, podrás seguir más tarde donde lo dejaste.', cerrar: ORIGEN_O3, trCerrar: TR.abrir,
        acciones: ButtonCTA({ texto: 'Salir', figma: 'Acción secundaria', estilo: 'outlined', go: '01-iniciar-sesion', tr: TR.disolver }) +
          ButtonCTA({ id: 'btn-seguir-formacion', texto: 'Seguir con la formación', figma: 'Acción principal', estilo: 'brand-dark', go: ORIGEN_O3, tr: TR.abrir }) });
    },
    base: ORIGEN_O3, opener: '#btn-salir-onboarding', escape: ORIGEN_O3, escapeTr: TR.abrir, foco: '#btn-seguir-formacion', dialogo: true
  });
  function fijarOrigenO3(id) {
    ORIGEN_O3 = id; SCREENS['onboarding-o3'].base = id; SCREENS['onboarding-o3'].escape = id;
  }

  /* ---------------------------------------------------------------------
     Accesos directos (hash estable y compartible)
     --------------------------------------------------------------------- */
  var FLUJOS = {
    'flujo/recorrido-completo': '01-iniciar-sesion',
    'flujo/no-puedo-entrar': '02-pedir-dni',
    'flujo/errores': 'picking-e1',
    'flujo/errores/posicion': 'picking-e1',
    'flujo/errores/carro': 'picking-e2',
    'flujo/errores/articulo': 'picking-e7',
    'flujo/errores/conexion': 'picking-e9',
    'flujo/salir-de-la-practica': 'picking-o1'
  };
  ERRORES.forEach(function (e) { FLUJOS['flujo/errores/' + e[0]] = 'picking-' + e[0]; });

  /* ---------------------------------------------------------------------
     Sonido (Web Audio) y vibración
     --------------------------------------------------------------------- */
  var avanceAuto = true;
  try { avanceAuto = localStorage.getItem('proto-avance-auto') !== 'no'; } catch (e) { /* sin almacenamiento */ }
  var FUERA = [document.getElementById('indice'), document.querySelector('.barra-presentador')];
  var audio = null;
  var sonido = true;
  try { sonido = localStorage.getItem('proto-sonido') !== 'no'; } catch (e) { /* sin almacenamiento */ }
  function despertarAudio() {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    try {
      if (!audio) audio = new AC();
      if (audio.state === 'suspended') audio.resume();
    } catch (e) { audio = null; }
  }
  function pitido() {
    if (!sonido || !audio) return;
    try {
      var t = audio.currentTime, osc = audio.createOscillator(), g = audio.createGain();
      osc.type = 'sine'; osc.frequency.value = 1760;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.25, t + 0.012);
      g.gain.setValueAtTime(0.25, t + 0.1);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
      osc.connect(g); g.connect(audio.destination);
      osc.start(t); osc.stop(t + 0.14);
    } catch (e) { /* sin sonido */ }
  }
  // Sonido de error (E1–E9): archivo facilitado por el usuario (assets/sonidos/error.mp3, 2,1 s).
  // En el archivo único va embebido (window.__SONIDOS, lo pone empaquetar.py).
  var audioError = null;
  function sonidoError() {
    if (!sonido) return;
    try {
      if (!audioError) audioError = new Audio((window.__SONIDOS && window.__SONIDOS['error.mp3']) || A + 'sonidos/error.mp3');
      audioError.pause(); audioError.currentTime = 0;
      var pr = audioError.play(); if (pr && pr.catch) pr.catch(function () { /* el navegador lo bloquea sin gesto previo */ });
    } catch (e) { /* sin sonido */ }
  }
  function pararSonidoError() { if (audioError) { try { audioError.pause(); } catch (e) { /* nada */ } } }
  function vibrar() {
    // Solo tras un gesto en la página (si no, el navegador lo bloquea y lo anota como error en la consola)
    var gesto = !navigator.userActivation || navigator.userActivation.hasBeenActive;
    if (navigator.vibrate && gesto) { try { navigator.vibrate(200); } catch (e) { /* no disponible */ } }
  }
  document.addEventListener('pointerdown', despertarAudio, true);
  document.addEventListener('keydown', despertarAudio, true);

  /* ---------------------------------------------------------------------
     Enrutador por hash
     --------------------------------------------------------------------- */
  var marco = document.getElementById('marco');
  var anuncio = document.getElementById('anuncio');
  var reducido = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  var actual = null;
  var temporizador = null;
  var ultimaPantalla = '01-iniciar-sesion';

  function rutaDesdeHash() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    try { h = decodeURIComponent(h); } catch (e) { /* tal cual */ }
    return h;
  }
  function escribirHash(id, reemplazar) {
    var url = '#/' + id;
    try {
      if (reemplazar) history.replaceState(null, '', url); else history.pushState(null, '', url);
    } catch (e) {
      if (reemplazar) location.replace(url); else location.hash = url;
    }
  }
  function cancelarTemporizador() { if (temporizador) { clearTimeout(temporizador); temporizador = null; } }

  function conTransicion(tr, cambiar, alTerminar) {
    var partes = (tr || TR.disolver).split(':');
    var tipo = partes[0], dur = parseInt(partes[1], 10) || 0;
    if (reducido && reducido.matches && tipo !== 'instant') { dur = tipo === 'bloque' ? 120 : Math.min(dur, 120); tipo = 'dissolve'; }
    var raiz = document.documentElement;
    if (tipo === 'instant' || dur === 0) { cambiar(); alTerminar(); return; }
    if (tipo === 'bloque') { pasoDeBloque(dur, cambiar, alTerminar); return; }
    raiz.style.setProperty('--vt-dur', dur + 'ms');
    if (document.startViewTransition) {
      raiz.classList.toggle('vt-smart', tipo === 'smart');
      var vt;
      try { vt = document.startViewTransition(cambiar); } catch (e) { cambiar(); alTerminar(); return; }
      if (vt.ready) vt.ready.catch(function () { /* transición omitida */ });
      if (vt.updateCallbackDone) vt.updateCallbackDone.catch(function () {});
      vt.finished.then(fin, fin);
    } else {
      cambiar();
      marco.classList.remove('entrando'); void marco.offsetWidth; marco.classList.add('entrando');
      setTimeout(fin, dur);
    }
    function fin() { raiz.classList.remove('vt-smart'); marco.classList.remove('entrando'); alTerminar(); }
  }

  // Paso de un bloque a otro del onboarding (2026-10-06, vídeo de referencia del usuario): la cabecera, el indicador
  // y las acciones se quedan quietos. El contenido sale unos píxeles hacia el lado, acelerando, y el nuevo entra
  // desde el otro lado frenando. dur > 0: hacia delante (sale por la izquierda); dur < 0: hacia atrás.
  var BLOQUE_SALIDA = 140, BLOQUE_ENTRADA = 320, HOJA_CIERRE = 250;
  function pasoDeBloque(dir, cambiar, alTerminar) {
    var sentido = dir < 0 ? -1 : 1;
    var viejo = marco.querySelector('.pantalla > .contenido');
    function entrar() {
      cambiar();
      var nuevo = marco.querySelector('.pantalla > .contenido');
      if (!nuevo || !nuevo.animate) { alTerminar(); return; }
      var a = nuevo.animate([
        { transform: 'translateX(' + (24 * sentido) + 'px)', opacity: 0 },
        { transform: 'translateX(0)', opacity: 1 }
      ], { duration: BLOQUE_ENTRADA, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' });
      a.onfinish = a.oncancel = function () { alTerminar(); };
    }
    if (!viejo || !viejo.animate) { entrar(); return; }
    var s = viejo.animate([
      { transform: 'translateX(0)', opacity: 1 },
      { transform: 'translateX(' + (-40 * sentido) + 'px)', opacity: 0 }
    ], { duration: BLOQUE_SALIDA, easing: 'cubic-bezier(0.42, 0, 1, 1)', fill: 'forwards' });
    s.onfinish = s.oncancel = entrar;
  }
  function bloqueDe(id) {
    var g = SCREENS[id] && SCREENS[id].grupo, m = g && /^Bloque (\d)/.exec(g);
    return m ? +m[1] : g === 'Picking sin errores' ? 4 : null;
  }

  function ir(id, tr, opciones) {
    opciones = opciones || {};
    if (!SCREENS[id]) id = '01-iniciar-sesion';
    cancelarTemporizador();
    var s = SCREENS[id];
    // Las pantallas automáticas (lectura, acierto) y los avances solos se reemplazan en el historial
    var reemplazar = opciones.reemplazar || (actual && SCREENS[actual] && SCREENS[actual].automatica) || !!s.automatica && opciones.desdeTemporizador;
    if (!opciones.sinHash) escribirHash(id, reemplazar);
    var anterior = actual;
    if (id === 'onboarding-o3' && anterior && /^Bloque /.test(SCREENS[anterior] ? SCREENS[anterior].grupo : '')) fijarOrigenO3(anterior);
    var bA = bloqueDe(anterior), bB = bloqueDe(id);
    if (bA && bB && bA !== bB && tr && tr.indexOf('instant') !== 0) tr = 'bloque:' + (bB > bA ? 1 : -1);
    actual = id; // se fija ya, para que popstate + hashchange no pinten dos veces
    // Al cerrar una hoja (volver a su pantalla base), baja hasta el borde inferior con ease out antes de la transición
    var hojaAbierta = anterior && SCREENS[anterior] && SCREENS[anterior].base === id && marco.querySelector('dialog.capa .hoja-modal, dialog.capa .hoja-de-opciones');
    var seguir = function () { conTransicion(tr, function () { pintar(id, anterior, opciones); }, function () { programar(id); }); };
    if (hojaAbierta && hojaAbierta.animate && !(reducido && reducido.matches)) {
      var baja = hojaAbierta.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(100%)' }],
        { duration: HOJA_CIERRE, easing: 'cubic-bezier(0, 0, 0.58, 1)', fill: 'forwards' });
      baja.onfinish = baja.oncancel = seguir;
    } else seguir();
  }

  function pintar(id, anterior, opciones) {
    opciones = opciones || {};
    var s = SCREENS[id];
    if (id === '01-iniciar-sesion' && anterior && SCREENS[anterior] && SCREENS[anterior].grupo !== 'Inicio de sesión') LOGIN = { dni: '', clave: '', dniHoja: '' };
    actual = id;
    ultimaPantalla = id;
    document.body.classList.remove('ver-indice');
    var hojaPrevia = marco.querySelector('dialog.capa .hoja-modal, dialog.capa .hoja-de-opciones');
    hojaPrevia = hojaPrevia ? hojaPrevia.getAttribute('data-figma') : null;
    marco.innerHTML = s.html() + (s.capa ? '<dialog class="capa" aria-modal="true" aria-labelledby="capa-titulo"' + (s.error ? ' aria-describedby="mensaje-error"' : '') + (s.dialogo ? ' role="alertdialog"' : '') + '>' + s.capa() + '</dialog>' : '');
    var dlg = marco.querySelector('dialog.capa');
    var base = marco.querySelector('.pantalla');
    // Las hojas (Hoja modal, Hoja de opciones) suben desde el borde inferior; el Overlay solo aparece (2026-10-06)
    var hoja = dlg && dlg.querySelector('.hoja-modal, .hoja-de-opciones');
    if (hoja && hoja.getAttribute('data-figma') !== hojaPrevia) hoja.classList.add('hoja--entrando');
    if (dlg) {
      base.setAttribute('inert', '');
      base.setAttribute('aria-hidden', 'true');
      try { dlg.show(); } catch (e) { dlg.setAttribute('open', ''); }
    }
    // I1 · Con una capa abierta, todo lo de fuera (índice y tira del presentador) queda inerte
    // El índice y la tira del presentador siguen activos con una capa abierta (petición del usuario,
    // 2026-10-05): desde un error o una hoja se puede saltar a otro flujo o acceso directo con el ratón.
    // El teclado sigue atrapado dentro de la capa (ver «Foco atrapado en las capas»).
    FUERA.forEach(function (el) { el.removeAttribute('inert'); });
    // M2 · Las hojas leen su texto (la consecuencia en O2)
    if (dlg && !s.error && dlg.querySelector('#capa-texto')) dlg.setAttribute('aria-describedby', 'capa-texto');
    // M4 · El título de la pantalla se describe con su «Bloque N de 5»
    var etiq = marco.querySelector('.pantalla .indicador__etiqueta'), h1 = marco.querySelector('.pantalla [data-titulo]');
    if (etiq && h1) { etiq.id = 'progreso-etiqueta'; h1.setAttribute('aria-describedby', 'progreso-etiqueta'); }
    document.title = s.nombre + ' · Prototipo onboarding';
    actualizarIndice(id);

    // Foco: acción segura en O2, primera opción en O1, título de la capa, o el botón que abrió la capa al volver
    var objetivo = null;
    if (opciones.foco) objetivo = marco.querySelector(opciones.foco);
    if (objetivo) { /* I5 */ }
    else if (dlg) {
      objetivo = s.foco ? dlg.querySelector(s.foco)
        : (!avanceAuto && s.automatica ? dlg.querySelector('button.scanner') : null) || dlg.querySelector('#capa-titulo');
    } else if (anterior && SCREENS[anterior] && SCREENS[anterior].base === id && SCREENS[anterior].opener) {
      objetivo = marco.querySelector(SCREENS[anterior].opener);
    }
    if (!objetivo) objetivo = marco.querySelector('[data-titulo]') || marco.querySelector('h1, h2');
    if (objetivo) { try { objetivo.focus({ preventScroll: true }); } catch (e) { objetivo.focus(); } }

    if (s.pitido) pitido();
    if (s.error) sonidoError(); else pararSonidoError();
    if (s.vibrar) vibrar();
    // I2 · La confirmación del acierto se repite en la pantalla de destino
    var previa = anterior && SCREENS[anterior];
    var conf = previa && previa.confirmacion && (previa.auto && previa.auto.to === id) ? previa.confirmacion : '';
    anunciar([conf, s.anuncio || ''].join(' ').trim());
  }

  function programar(id) {
    var s = SCREENS[id];
    if (actual !== id || !s.auto) return;
    if (s.automatica && !avanceAuto) return; // I2 · sin avance automático: lectura y acierto esperan
    cancelarTemporizador();
    temporizador = setTimeout(function () {
      temporizador = null;
      if (actual === id) ir(s.auto.to, s.auto.tr, { reemplazar: true, desdeTemporizador: true });
    }, s.auto.ms);
  }

  function anunciar(texto) {
    anuncio.textContent = '';
    if (texto) setTimeout(function () { anuncio.textContent = texto; }, 60);
  }

  function alCambiarHash() {
    var ruta = rutaDesdeHash();
    if (ruta === 'indice') { mostrarIndice(); return; }
    if (FLUJOS[ruta]) { ir(FLUJOS[ruta], TR.disolver, { reemplazar: true }); return; }
    if (!SCREENS[ruta]) { ir('01-iniciar-sesion', TR.disolver, { reemplazar: true }); return; }
    if (ruta === actual) return;
    ir(ruta, TR.disolver, { sinHash: true });
  }

  function mostrarIndice() {
    cancelarTemporizador();
    document.body.classList.add('ver-indice');
    FUERA.forEach(function (el) { el.removeAttribute('inert'); });
    document.getElementById('volver-al-prototipo').setAttribute('href', '#/' + ultimaPantalla);
    actual = null;
    var t = document.getElementById('titulo-accesos');
    if (t) { t.setAttribute('tabindex', '-1'); t.focus(); }
  }

  /* ---------------------------------------------------------------------
     Interacción
     --------------------------------------------------------------------- */
  var avisoT = null;
  function avisoNoIncluido() {
    var el = document.getElementById('aviso-prototipo');
    el.textContent = '';
    setTimeout(function () { el.textContent = 'No incluido en el prototipo'; }, 50);
    el.classList.add('visible');
    clearTimeout(avisoT);
    avisoT = setTimeout(function () { el.classList.remove('visible'); el.textContent = ''; }, 2500);
  }


  // M7 · Pista visible (fuera del marco) mientras el visor tiene el foco
  var pista = document.getElementById('pista-visor');
  marco.addEventListener('focusin', function (ev) {
    if (ev.target.matches && ev.target.matches('button.scanner')) {
      pista.textContent = 'Intro o toque en el visor: ' + ev.target.getAttribute('aria-label').toLowerCase();
      pista.classList.add('visible');
    }
  });
  marco.addEventListener('focusout', function () { pista.classList.remove('visible'); });

  marco.addEventListener('click', function (ev) {
    var ver = ev.target.closest('[data-ver-clave]');
    if (ver) {
      ev.stopPropagation();
      var clave = document.getElementById('clave');
      var mostrar = ver.getAttribute('aria-pressed') !== 'true';
      clave.type = mostrar ? 'text' : 'password';
      ver.setAttribute('aria-pressed', mostrar ? 'true' : 'false');
      ver.querySelector('img').src = ojoSrc(clave.value.length > 0, mostrar);
      return;
    }
    var t = ev.target.closest('[data-go], [data-nd]');
    if (!t || !marco.contains(t) || t.disabled || t.getAttribute('aria-disabled') === 'true') return;
    if (t.hasAttribute('data-nd')) { avisoNoIncluido(); return; }
    ir(t.getAttribute('data-go'), t.getAttribute('data-tr'));
  });
  // Campos editables del login y de la hoja: guardan el valor, mueven la etiqueta y activan el botón
  function activar(btn, ok) {
    if (!btn) return;
    if (ok) { btn.removeAttribute('aria-disabled'); btn.removeAttribute('aria-describedby'); }
    else { btn.setAttribute('aria-disabled', 'true'); btn.setAttribute('aria-describedby', btn.id === 'btn-avisar' ? 'requisito-avisar' : 'requisito-entrar'); }
  }
  marco.addEventListener('input', function (ev) {
    var t = ev.target, campo = t.getAttribute && t.getAttribute('data-campo');
    if (!campo) return;
    if (campo !== 'clave') { var limpio = t.value.replace(/\D/g, '').slice(0, 8); if (limpio !== t.value) t.value = limpio; }
    // En las pantallas «/ rellenado» se parte del ejemplo: al editar, se pasa a guardar lo escrito
    if (/rellenado$/.test(actual)) { LOGIN.dni = valorDe('dni', LOGIN.dni); LOGIN.clave = valorDe('clave', LOGIN.clave); LOGIN.dniHoja = valorDe('dni-hoja', LOGIN.dniHoja); }
    LOGIN[campo] = t.value;
    t.closest('.text-input').classList.toggle('is-filled', t.value.length > 0);
    if (campo === 'clave') { var ojo = marco.querySelector('[data-ver-clave] img'); if (ojo) ojo.src = ojoSrc(t.value.length > 0, t.type === 'text'); }
    activar(document.getElementById('btn-entrar'), loginCompleto(LOGIN));
    activar(document.getElementById('btn-avisar'), /^\d{8}$/.test(LOGIN.dniHoja));
  });
  function valorDe(id, def) { var el = document.getElementById(id); return el ? el.value : def; }
  // Intro en un campo equivale a pulsar la acción principal, si está activa
  marco.addEventListener('keydown', function (ev) {
    var t = ev.target;
    if (ev.key !== 'Enter' || !t.matches || !t.matches('input[data-campo]')) return;
    var btn = document.getElementById(t.id === 'dni-hoja' ? 'btn-avisar' : 'btn-entrar');
    if (btn && btn.getAttribute('aria-disabled') !== 'true') { ev.preventDefault(); btn.click(); }
  });
  // Foco atrapado en las capas: con una capa abierta, Tab y Mayús+Tab dan la vuelta dentro de ella
  // (sustituye a volver inertes el índice y la tira, que impedía usarlos con el ratón)
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Tab') return;
    var dlg = marco.querySelector('dialog.capa');
    if (!dlg) return;
    var focos = Array.prototype.filter.call(
      dlg.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'),
      function (el) { return !el.disabled && el.offsetParent !== null; });
    if (!focos.length) return;
    var primero = focos[0], ultimo = focos[focos.length - 1], a = document.activeElement;
    if (!dlg.contains(a)) { ev.preventDefault(); (ev.shiftKey ? ultimo : primero).focus(); return; }
    if (ev.shiftKey && a === primero) { ev.preventDefault(); ultimo.focus(); }
    else if (!ev.shiftKey && a === ultimo) { ev.preventDefault(); primero.focus(); }
  });
  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Escape' || !actual) return;
    var s = SCREENS[actual];
    if (s && s.escape) { ev.preventDefault(); ir(s.escape, s.escapeTr); }
  });
  window.addEventListener('popstate', alCambiarHash);
  window.addEventListener('hashchange', alCambiarHash);

  /* ---------------------------------------------------------------------
     Índice para presentar
     --------------------------------------------------------------------- */
  function construirIndice() {
    var acc = document.getElementById('accesos');
    var errPorPaso = [
      ['Posición', ['e1', 'e5', 'e6']],
      ['Carro', ['e2', 'e3', 'e4']],
      ['Artículo', ['e7', 'e8']],
      ['Conexión', ['e9']]
    ];
    var chips = errPorPaso.map(function (g) {
      return '<span class="acceso__grupo">' + g[0] + '</span><span class="acceso__chips">' + g[1].map(function (e) {
        var s = SCREENS['picking-' + e];
        return '<a href="#/flujo/errores/' + e + '" data-pantalla="picking-' + e + '" title="' + esc(s.nombre) + '">' + e.toUpperCase() + '</a>';
      }).join('') + '</span>';
    }).join('');
    // Accesos recogidos: una línea por acceso. La explicación queda como descripción accesible
    // (aria-describedby) y como tooltip, para que el índice entero quepa sin desplazarse.
    function acceso(id, href, texto, desc, extra) {
      return '<li><a class="acceso__enlace" href="' + href + '" aria-describedby="desc-' + id + '" title="' + esc(desc) + '">' + texto + '</a>' +
        '<p class="solo-lector" id="desc-' + id + '">' + desc + '</p>' + (extra || '') + '</li>';
    }
    acc.innerHTML =
      acceso('completo', '#/flujo/recorrido-completo', 'Flujo completo correcto',
        'Login → bloques 1–5 → picking sin errores → 10. Empieza en 01 · Iniciar sesión. En la cámara, tocar el visor (o Intro con el foco en él) simula la lectura.') +
      acceso('no-entrar', '#/flujo/no-puedo-entrar', 'No puedo entrar',
        'Hoja «No has podido entrar» abierta: escribe los 8 números del DNI → Avisar y continuar → Ya hemos avisado → 03.') +
      // «Flujos de error» es un acordeón: dentro, el recorrido en secuencia y los errores por paso.
      '<li><details class="acordeon acordeon--errores"><summary class="acordeon__titulo" aria-describedby="desc-errores" title="' +
        esc('Toca el visor para pasar al error siguiente. La X del aviso vuelve a la lectura; la X de la cámara, al paso.') + '">Flujos de error (E1 → E9 → O1)</summary>' +
        '<p class="solo-lector" id="desc-errores">Toca el visor para pasar al error siguiente. La X del aviso vuelve a la lectura; la X de la cámara, al paso.</p>' +
        '<div class="acceso__errores"><a class="acceso__secuencia" href="#/flujo/errores">Todos en secuencia</a>' + chips + '</div></details></li>' +
      acceso('salir', '#/flujo/salir-de-la-practica', 'Salir de la práctica',
        'Picking 04 con el menú ··· abierto (O1) → Salir de la práctica → O2. «Seguir practicando» vuelve a Picking 04; «Salir y perder el progreso» va a 09.');

    // Acordeones (details/summary): un grupo por bloque, con el nombre del «Indicador de progreso».
    // El picking va en «Bloque 4 · Práctica»: sus marcos no llevan indicador; el recorrido documentado
    // es 09 (Bloque 4 de 5 · Práctica) → Picking 01…08 → 10 (Bloque 5 de 5 · Cierre).
    var ACORDEONES = [
      ['Inicio de sesión', ['Inicio de sesión']],
      ['Bloque 1 · Introducción', ['Bloque 1 · Introducción']],
      ['Bloque 2 · Herramienta', ['Bloque 2 · Herramienta']],
      ['Bloque 3 · Seguridad', ['Bloque 3 · Seguridad']],
      ['Bloque 4 · Práctica', ['Bloque 4 · Práctica', 'Picking sin errores']],
      ['Bloque 5 · Cierre', ['Bloque 5 · Cierre']],
      ['Errores y opciones', ['Errores E1–E9', 'Opciones O1–O3']]
    ];
    document.getElementById('lista-pantallas').innerHTML = ACORDEONES.map(function (a, i) {
      var ids = ORDEN.filter(function (id) { return a[1].indexOf(SCREENS[id].grupo) !== -1; });
      return '<details class="acordeon" data-acordeon="' + i + '"><summary class="acordeon__titulo">' + esc(a[0]) +
        ' <span class="acordeon__n">(' + ids.length + ')</span></summary><ul class="lista-pantallas">' + ids.map(function (id) {
        return '<li><a href="#/' + id + '" data-pantalla="' + id + '">' + esc(SCREENS[id].nombre) + '</a></li>';
      }).join('') + '</ul></details>';
    }).join('');
  }
  function actualizarIndice(id) {
    var links = document.querySelectorAll('.indice [data-pantalla]');
    for (var i = 0; i < links.length; i++) {
      if (links[i].getAttribute('data-pantalla') === id) links[i].setAttribute('aria-current', 'page');
      else links[i].removeAttribute('aria-current');
    }
    // No abre acordeones solo (el índice tiene que verse entero sin desplazarse): marca el grupo
    // que contiene la pantalla actual, y el usuario lo abre si quiere.
    var grupos = document.querySelectorAll('#lista-pantallas details');
    for (var g = 0; g < grupos.length; g++) {
      if (grupos[g].querySelector('[data-pantalla="' + id + '"]')) grupos[g].setAttribute('data-actual', '');
      else grupos[g].removeAttribute('data-actual');
    }
    var nombre = SCREENS[id].nombre;
    document.getElementById('nombre-pantalla').textContent = nombre;
    document.getElementById('nombre-movil').textContent = nombre;
  }

  var chkAuto = document.getElementById('avance-auto');
  chkAuto.checked = avanceAuto;
  chkAuto.addEventListener('change', function () {
    avanceAuto = chkAuto.checked;
    try { localStorage.setItem('proto-avance-auto', avanceAuto ? 'si' : 'no'); } catch (e) { /* sin almacenamiento */ }
  });

  var chk = document.getElementById('sonido');
  chk.checked = sonido;
  chk.addEventListener('change', function () {
    sonido = chk.checked;
    try { localStorage.setItem('proto-sonido', sonido ? 'si' : 'no'); } catch (e) { /* sin almacenamiento */ }
    if (sonido) { despertarAudio(); pitido(); } else pararSonidoError();
  });

  /* ---------------------------------------------------------------------
     Marco 360 × 600 escalado en escritorio
     --------------------------------------------------------------------- */
  // B1 · Nunca se reduce por debajo de 1: si el marco 360 × 600 no cabe (ventana baja o zoom), pantalla completa
  function escalar() {
    var raiz = document.documentElement;
    // El dispositivo de escritorio mide 384 × 680 (pantalla 360 × 600 más el cuerpo)
    var cabe = window.innerWidth > 600 && window.innerWidth - 320 - 32 >= 384 && window.innerHeight - 48 - 70 >= 680;
    raiz.classList.toggle('compacto', !cabe);
    raiz.style.setProperty('--escala', '1');
  }
  window.addEventListener('resize', escalar);

  /* ---------------------------------------------------------------------
     Arranque
     --------------------------------------------------------------------- */
  construirIndice();
  escalar();
  (function inicio() {
    var ruta = rutaDesdeHash();
    // F5 (o ⌘R / Ctrl+R): recargar lleva siempre al inicio del flujo completo correcto, con los campos
    // vacíos. Abrir un enlace compartido (una navegación nueva, no una recarga) sigue yendo a su pantalla.
    var nav = window.performance && performance.getEntriesByType && performance.getEntriesByType('navigation')[0];
    if (nav && nav.type === 'reload') ruta = 'flujo/recorrido-completo';
    if (ruta === 'indice') { pintar('01-iniciar-sesion'); mostrarIndice(); return; }
    var id = FLUJOS[ruta] || (SCREENS[ruta] ? ruta : '01-iniciar-sesion');
    escribirHash(id, true);
    pintar(id, null);
    programar(id);
  })();
})();

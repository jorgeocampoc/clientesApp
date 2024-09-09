
var productos = JSON.parse(localStorage.getItem('productos')) || [];
var proveedores = JSON.parse(localStorage.getItem('proveedores')) || [];
var compras = JSON.parse(localStorage.getItem('compras')) || [];
var carrito = [];

function cargarProducto(){

    var cadena = '';
    for(let i = 0; i < productos.length; i++){
        cadena += `<tr>
                        <td>${productos[i].producto}</td>
                        <td>${productos[i].precio}</td>
                        <td>${productos[i].stock}</td>
                        <td>
                            <div class="acciones">
                                <button onclick='agregarCarrito(${i})'  class="btn btn-show m5">
                                     <i class="fa fa-plus"></i>
                                </button>
                            
                            </div>
                        </td>
                    </tr>
                    `;
    }

    if(productos.length == 0){
        cadena += `<tr>
                        <td colspan="4" align="center">
                            <br>
                            <br>
                                No hay productos registrados!
                                <br>
                                <br>
                                <br>
                                <a href="productosForm.html" class="btn btn-nuevo">
                                    <i  class="fa fa-plus"></i>
                                    Nuevo
                                </a>
                            <br>
                            <br>
                            <br>
                            <br>
                        </td>
                    </tr>
                    `;
    }

    document.getElementById('listaProductos').innerHTML = cadena;
}



function buscarProducto(){
    var buscador = document.getElementById('buscar').value;

    var nuevoArray = [];
    
    if(buscador.trim() == '' || buscador.trim() == null){
        nuevoArray = JSON.parse(localStorage.getItem('productos')) || [];
    } else {
        
        for(let i = 0; i < productos.length; i++){
            var texto = productos[i].producto.toLowerCase();
            if(texto.search(buscador.toLowerCase()) >= 0){
                nuevoArray.push(productos[i]);
            }
        }
    }

    productos = nuevoArray;
    cargarProducto();
}


function cargarproveedores(){
    var cadena = '';
    for(let i = 0; i < proveedores.length; i++){
        cadena+=`
               <option value="${proveedores[i].empresa}">${proveedores[i].empresa}</option>
        `
    }
    document.getElementById('proveedor').innerHTML = cadena;
}


function agregarCarrito( parametro ){
    
    var elemento = {
        producto: productos[parametro].producto,
        precio: productos[parametro].precio,
        stock: productos[parametro].stock,
        cantidad: 1,
        subtotal: function(){
            return this.cantidad * this.precio;
        }
    }

    carrito.push(elemento);
    cargarCarrito()
}

function cargarCarrito(){
    var cadena ='';
    for (let i = 0; i < carrito.length; i++) {
            cadena += `
                  <tr>
                     <td>${carrito[i].producto}</td>
                     <td>${carrito[i].precio}</td>
                     <td>
                         <input type="number" onchange='cambiaCantidad(${i},this)' value="${carrito[i].cantidad}"  class="form" placeholder="Cantidad">
                     </td>
                     <td>${carrito[i].subtotal()}</td>
                     <td>
                         <button onclick='quitarCarrito(${i})' class="btn btn-delete m5">
                             <i class="fa fa-times"></i>
                         </button>
                     </td>
                 </tr>
            `;
    }
    document.getElementById('listaCarrito').innerHTML = cadena;
    calcularTotal()
}


function quitarCarrito( posicion ){
    carrito.splice(posicion,1);
    cargarCarrito()
}

function calcularTotal(){
    var total = 0;
    for (let i = 0; i < carrito.length; i++) {
         total += carrito[i].subtotal();
    }
    document.getElementById('total').innerHTML = total;
}


function cambiaCantidad(posicion, elemento){
    if( elemento.value <= 0){
        Swal.fire({
            title: "No puede ser cero!",
            text: "La cantidad no puede ser menor que cero",
            icon: "warning"
        });
        return;
    }
    carrito[posicion].cantidad = (elemento.value !== null || elemento.value !== '')? elemento.value:1;
    cargarCarrito()
}

function registrarCompra(){


    var proveedor = document.getElementById('proveedor').value;
    var fecha = document.getElementById('fecha').value;
    var comprobante = document.getElementById('numComprobante').value;
    var total = 0;


  

    for (let i = 0; i < carrito.length; i++) {
         total += carrito[i].subtotal();
    }

    if( proveedor == '' || fecha == '' || comprobante == '' || total == 0){
        Swal.fire({
            title: "Faltan datos",
            text: "Complete los campos",
            icon: "warning"
        });
        return;
    }
    var compra = 
    {
        proveedor:proveedor,
        fecha:fecha,
        comprobante:comprobante,
        total:total,
        usuario:'jorge ocampo',
        detalles:carrito,
    }
    compras.push( compra );
    localStorage.setItem( 'compras',JSON.stringify(compras) );


    var losProductos = JSON.parse(localStorage.getItem('productos'));

    for (let i = 0; i < carrito.length; i++) {
        for (let j = 0; j < losProductos.length; j++) {
            if(losProductos[j].producto == carrito[i].producto){
                losProductos[j].stock = parseInt(losProductos[j].stock + parseInt(carrito[i].cantidad));
            }
        }
    }
    localStorage.setItem('productos',JSON.stringify(losProductos));
    window.location.href = 'compras.html';
}


function cargarDatos(){

    var cadena = '';
    for(let i = 0; i < compras.length; i++){
        cadena += `<tr>
                        <td>${i+1}</td>
                        <td>${compras[i].proveedor}</td>
                        <td>${compras[i].fecha}</td>
                        <td>${compras[i].comprobante}</td>
                        <td>${compras[i].total}</td>
                        <td>${compras[i].usuario}</td>
                        <td>
                            <div class="acciones">
                                <button onclick="verCompra(${i})" class="btn btn-show m5">
                                    <i class="fa fa-eye"></i>
                                </button>
                                <button onclick="eliminarCompra(${i})" class="btn btn-delete m5">
                                    <i class="fa fa-times"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                    `;
    }

    if(productos.length == 0){
        cadena += `<tr>
                        <td colspan="7" align="center">
                            <br>
                            <br>
                                No hay compras registrados!
                                <br>
                                <br>
                                <br>
                                <a href="comprasForm.html" class="btn btn-nuevo">
                                    <i class="fa fa-plus"></i>
                                    Nuevo
                                </a>
                            <br>
                            <br>
                            <br>
                            <br>
                        </td>
                    </tr>
                    `;
    }

    document.getElementById('listaCompras').innerHTML = cadena;
}


function buscarCompra(){
    var buscador = document.getElementById('buscar').value;

    var nuevoArray = [];
    
    if(buscador.trim() == '' || buscador.trim() == null){
        nuevoArray = JSON.parse(localStorage.getItem('compras')) || [];
    } else {
        
        for(let i = 0; i < compras.length; i++){
            var texto = compras[i].proveedor.toLowerCase();
            if(texto.search(buscador.toLowerCase()) >= 0){
                nuevoArray.push(compras[i]);
            }
        }
    }

    compras = nuevoArray;
    cargarDatos();
}
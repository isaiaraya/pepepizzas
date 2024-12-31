import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../services/products.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.page.html',
  styleUrls: ['./crud.page.scss'],
})
export class CrudPage implements OnInit {
  nombre: string = '';
  precio: number = 0;
  imagen: string = '';
  categoria: string = 'pizzas'; // Por defecto, pizzas
  productos: any[] = [];
  productoEditadoId: string | null = null; // Para rastrear el producto que estamos editando

  constructor(private productsservice: ProductsService) {}

  ngOnInit() {
    // Cargar los productos al inicializar la página
    this.cargarProductos();
  }

  // Crear un producto
  agregarProducto() {
    const nuevoProducto = {
      nombre: this.nombre,
      precio: this.precio,
      imagen: this.imagen,
      categoria: this.categoria,
    };

    this.productsservice.agregarProducto(nuevoProducto).then(() => {
      // Recargar los productos de la categoría seleccionada
      this.cargarProductos();
      this.limpiarCampos();
    }).catch(error => {
      console.error('Error al agregar producto', error);
    });
  }

  // Cargar productos por categoría
  cargarProductos() {
    this.productsservice.obtenerProductos(this.categoria).subscribe((productos) => {
      this.productos = productos.map((producto: any) => {
        return { ...producto, id: producto.id }; // Asegurarse de que el id esté presente
      });
    }, (error) => {
      console.error('Error al cargar productos', error);
    });
  }

  // Eliminar un producto
  eliminarProducto(id: string) {
    this.productsservice.eliminarProducto(id).then(() => {
      // Recargar los productos de la categoría seleccionada después de eliminar
      this.cargarProductos();
    }).catch(error => {
      console.error('Error al eliminar producto', error);
    });
  }

  // Limpiar los campos después de agregar un producto
  limpiarCampos() {
    this.nombre = '';
    this.precio = 0;
    this.imagen = '';
    this.categoria = 'pizzas'; // Resetear la categoría a 'pizzas'
  }

  // Cambiar la categoría y recargar productos
  cambiarCategoria() {
    this.cargarProductos(); // Cargar los productos de la nueva categoría seleccionada
  }

  // Editar un producto
  editarProducto(producto: any) {
    this.productoEditadoId = producto.id;
    this.nombre = producto.nombre;
    this.precio = producto.precio;
    this.imagen = producto.imagen;
    this.categoria = producto.categoria;
  }

  // Guardar los cambios de edición
  guardarEdicion() {
    if (this.productoEditadoId) {
      const productoActualizado = {
        nombre: this.nombre,
        precio: this.precio,
        imagen: this.imagen,
        categoria: this.categoria,
      };

      this.productsservice.actualizarProducto(this.productoEditadoId, productoActualizado).then(() => {
        this.cargarProductos();
        this.limpiarCampos();
        this.productoEditadoId = null; // Resetear el id del producto editado
      }).catch(error => {
        console.error('Error al actualizar producto', error);
      });
    }
  }

  
}

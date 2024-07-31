import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Product } from '../../models/product.model';
import { Department } from '../../models/department.model';
import { ProductService } from '../../services/product.service';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  product: Product;
  departments: Department[] = [];
  isEditMode: boolean = false;

  constructor(
    private productService: ProductService,
    private departmentService: DepartmentService,
    public dialogRef: MatDialogRef<ProductFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product: Product }
  ) {

    this.product = data.product ? { ...data.product } : this.createEmptyProduct();
    this.isEditMode = !!data.product;
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe((departments) => {
      this.departments = departments;
    });
  }

  createEmptyProduct(): Product {
    return {
      id: '',
      code: '',
      description: '',
      departmentId: '',
      price: 0,
      status: false,
      deleted: false,
      departmentName: ''
    };
  }

  saveProduct(): void {
    if (this.isEditMode) {
      this.productService.updateProduct(this.product.id, this.product).subscribe(
        () => this.dialogRef.close(true),
        error => console.error('Error updating product:', error)
      );
    } else {
      this.productService.addProduct(this.product).subscribe(
        () => this.dialogRef.close(true),
        error => console.error('Error adding product:', error)
      );
    }
  }

  closeDialog(): void {
    this.dialogRef.close(false);
  }
}

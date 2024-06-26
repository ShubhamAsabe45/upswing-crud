import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ProductListService } from '../Services/product-list.service';
import { ProductModel } from './product.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  productForm!: FormGroup;
  displayModal: boolean = false;
  productModelObj: ProductModel = new ProductModel();
  productData: ProductModel[] = [];
  edit: boolean = false;
  id: number = 0;
  errMsg: boolean = false;
  barChartData: any;
  barChartOptions: any;

  constructor(private http: HttpClient, private fb: FormBuilder, private productService: ProductListService) {
    this.creatForm();
  }
  ngOnInit(): void {
    this.getProductDetails();
    this.prepareBarChartData();
  }

  // Form Creation
  creatForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      price: ['', [Validators.required]],
      category: ['', Validators.required]
    });
  }


  // Chart Logic
  prepareBarChartData() {
    if (this.productData.length > 0) {
      // Extract labels and data dynamically from productData
      const labels = this.productData.map(product => product.name);
      const data = this.productData.map(product => product.price);

      // Generate random colors for each bar
      const backgroundColor = this.productData.map(() => '#' + Math.floor(Math.random() * 16777215).toString(16));

      this.barChartData = {
        labels: labels,
        datasets: [
          {
            label: 'Prices',
            backgroundColor: backgroundColor,
            data: data
          }
        ]
      };

      this.barChartOptions = {
        responsive: true,
        legend: { position: 'top' },
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Category' // X-axis label
            },
            gridLines: { display: false }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Price ($)'
            },
            gridLines: { display: false },
            ticks: {
              beginAtZero: false,
              min: 100, // Start Y-axis from 10000
              callback: function (value: any) {
                if (parseInt(value) >= 100) {
                  return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                } else {
                  return '$' + value;
                }
              }
            }
          }]
        }
      };
    }
  }



  onClick() {
    this.displayModal = true;
    this.edit = false;
    this.productForm.controls['name'].setValue('');
    this.productForm.controls['price'].setValue('');
    this.productForm.controls['category'].setValue('');
  }

  
  // Add Product
  postProductDetails() {
    this.productModelObj.name = this.productForm.value.name;
    this.productModelObj.price = this.productForm.value.price;
    this.productModelObj.category = this.productForm.value.category;

    if (this.productForm.valid) {
      this.productService.postProduct(this.productModelObj).subscribe((res) => {
        console.log('Data inserted sucessfully');
        alert('Data added sucessfully.');
        this.productForm.reset();
        let ref = document.getElementById('cancle');
        ref?.click();
        this.getProductDetails();
        this.displayModal = false;
      },
        error => {
          alert('something went wrong.')
        }
      )
    } else {
      // this.errMsg = true;
      this.productForm.markAllAsTouched();

    }

  }

  // Get Product List
  getProductDetails() {
    this.productService.getProduct().subscribe(
      res => {
        this.productData = res;
        this.prepareBarChartData();
      },
      error => {
        console.log('Error reciving data');
      }
    )
  }

  // Delete the particular product
  deleteProduct(row: ProductModel) {
    this.productService.deleteProduct(row.id).subscribe(
      res => {
        alert('Employee deleted');
        this.getProductDetails();
      },
      error => {
        console.log('Error reciving data');
      }
    )
  }


  // Update Product
  onEdit(row: any) {
    this.displayModal = true;
    this.edit = true;
    this.id = row.id;
    this.productForm.controls['name'].setValue(row.name);
    this.productForm.controls['price'].setValue(row.price);
    this.productForm.controls['category'].setValue(row.category);
  }

  // Update Product
  updateProduct() {
    this.displayModal = false;
    this.productModelObj.name = this.productForm.value.name;
    this.productModelObj.price = this.productForm.value.price;
    this.productModelObj.category = this.productForm.value.category;

    this.productService.updateProduct(this.productModelObj, this.id).subscribe((res) => {
      console.log('Data updated sucessfully');
      alert('Data updated sucessfully.');
      this.productForm.reset();
      let ref = document.getElementById('cancle');
      ref?.click();
      this.getProductDetails();
    },
      error => {
        console.log(error)
        alert('something went wrong.')
      })
  }

  close() {
    this.displayModal = false;
    this.productForm.reset();
  }
}

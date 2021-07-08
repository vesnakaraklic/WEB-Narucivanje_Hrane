Vue.component("products", {
	data: function () {
		return {
			product: {
				name: "",
				price: "",
				productType: "",
				quantity: "",
				description: "",
				image: "",
			},
			errorMessage:"",
			manager: {
				id: null,
				username: null,
				password: null,
				firstname: null,
				lastname: null,
				gender:null,
				role:null,
				restaurant: {
					id: "",
					name: "",
					type: "",
					products: [],
					restaurantStatus: "",
					location: {
						longitude: "",
						latitude: "",
						streetName: "",
						city: "",
						zipCode: ""
					},
					logo: "",
				}
			},
		}
	},
	mounted () {
		let u = JSON.parse(localStorage.user);
		axios
		.post("rest/manager/getById",u)
		.then(response => {
			this.restaurant = response.data.restaurant;
			console.log(this.restaurant);
			this.manager=response.data;
		})
	},
	methods: {
		checkForm: function() {
			if(this.isFormValid()) {
				let vue= this;
				const file = document.getElementById("img_file").files[0];
	
				var reader = new FileReader();
				reader.onload = function(event) {
					if(vue.isProductUnique()) {
						vue.errorMessage = "";
						let prodList =  vue.manager.restaurant.products?vue.manager.restaurant.products:[];
						vue.product.image=event.target.result;
						if(prodList.length>0) 
						{
							vue.manager.restaurant.products.push(vue.product);
						} else {
							vue.manager.restaurant.products = [vue.product];
						}
						
						axios
						.post("rest/manager/update", vue.manager)
						.then(response => {
							axios
							.post("rest/restaurant/update", vue.manager.restaurant)
							.then(response1 => {
								$("#addProductModal").modal('hide');
							})
						})
					} else {
						vue.errorMessage = "Product name already exists!";
					}
				}
				reader.readAsDataURL(file);
				
				
				
			}
		
		},
		isFormValid: function() {
			if(this.product.name == "" || this.product.price == "" || this.product.type == "" || document.getElementById("img_file").value == "") {
				this.errorMessage = "All fields are required!";
				return false;
			} 
			this.errorMessage="";
			return true;
		},
		
		isProductUnique: function() {
			let prodArray = this.manager.restaurant.products?this.manager.restaurant.products:[];
			let isValid = true;
			if(prodArray.length > 0) {
				prodArray.forEach(p=> {
					if(this.product.name == p.name) {
						isValid = false;
					}
				});
			} 
			return isValid;
		},
		
		onImageChange: function() {
			const file = document.getElementById("img_file").files[0];
			var url = URL.createObjectURL(file);
			var img = document.getElementById("product_img");
			img.src = url;
			img.style.display = "block";
		},
		
		resetForm: function() {
			this.product= {
				name: "",
				price: "",
				productType: "",
				quantity: "",
				description: "",
				image: "",
			}
			this.errorMessage ="";
			var file = document.getElementById("img_file");
			file.files[0] = null;
			file.value="";
			var img = document.getElementById("product_img");
			img.src = "";
			img.style.display = "none";
		},
		
		priceValidation: function(event) {
			const searchRegExp = /[^0-9]/g;
			let v = this.product.price.replace(searchRegExp, "");
			this.product.price = v;
		},
		
		quantityValidation: function(event) {
			const searchRegExp = /[^0-9]/g;
			let v = this.product.quantity.replace(searchRegExp, "");
			this.product.quantity = v;
		}
	
	},
	template: `
	<div>
	<h2 class="text-center py-5"> PRODUCTS </h2>
	<button type="button" style="font-weight: 700;" class="btn btn-primary mb-3 offset-md-10 col-md-2" v-on:keyup="resetForm" data-bs-toggle="modal" data-bs-target="#addProductModal">
			  Add
			</button>
	<table class="table table-bordered bg-light mb-5" style="border-color:#607d8b" >
				<thead>
				<tr style="background: #0d6efd; text-align: center; color: white;border-color: #0e4494; ">
					<th>Name</th>
					<th>Price</th>
					<th>Type</th>
					<th>Quantity</th>
					<th>Description</th>
					<th>Image</th>
				</tr>
				</thead>
				<tbody>
					<tr v-for="product in manager.restaurant.products">
						<td>{{product.name}}</td>
						<td>{{product.price}}</td>
						<td>{{product.productType}}</td>
						<td>{{product.quantity}}</td>
						<td>{{product.description}}</td>
						<td><img v-if="product.image!=''" v-bind:src="product.image" alt="" width="40" height="40"></td>
					</tr>
				</tbody>
				</table>
				<!-- Modal -->
		<div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="Modal" aria-hidden="true">
		  <div class="modal-dialog">
		    <div class="modal-content">
		      <div class="modal-header">
		        <h5 class="modal-title">Add product</h5>
		        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
		      </div>
		      <div class="modal-body">
		      <!--   MODAL FORM    -->
		        <div class="form-floating mb-2">
			      <input type="text" class="form-control" name="name" v-model="product.name" placeholder="Name">
			      <label for="floatingInput">Name</label>
			    </div>
			    <div class="form-floating mb-2">
			      <input type="text" class="form-control" name="price" v-model="product.price" @change="priceValidation" placeholder="Price">
			      <label for="floatingInput">Price</label>
			    </div>
			    <div class="form-floating mb-2">
			    <select class="form-control" id="typeSelect" name="type" v-model="product.productType" placeholder="Type">
				    <option value="FOOD">Food</option>
				    <option value="DRINK">Drink</option>
			     </select>
			     <label for="floatingInput">Type</label>
			     </div>
			    <div class="form-floating mb-2">
			      <input type="text" class="form-control" name="Quantity" v-model="product.quantity" @change="quantityValidation" placeholder="Quantity">
			      <label for="floatingInput">Quantity</label>
			    </div>
			    <div class="form-floating mb-2">
			      <input type="text" class="form-control" name="description" v-model="product.description" placeholder="Description">
			      <label for="floatingInput">Description</label>
			    </div>
			     <!-- LOGO FIELD -->
			    <img style="display:none" id="product_img" src="" alt="" width="107" height="98">
				<div class="mb-2">
				  <label for="img_file" class="form-label">Image</label>
				  <input @change="onImageChange()"  class="form-control form-control-lg" id="img_file" type="file">
				</div>
		      <!--   MODAL FORM  END  -->
	    		<span class="errorMessage mr-3">{{errorMessage}}</span>
		      </div>
		      <div class="modal-footer">
		        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
		        <button type="button" class="btn btn-primary" v-on:click="checkForm()">Add</button>
		      </div>
				</div>
				</div>
				</div>
				</div>
	`
})
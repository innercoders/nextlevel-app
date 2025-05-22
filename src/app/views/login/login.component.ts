import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { UserService } from '@app/service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NzGridModule,
		NzFormModule,
		NzInputModule,
		NzButtonModule,
		NzIconModule,
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.less'
})
export class LoginComponent {

	loginForm: FormGroup;

	constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.minLength(6), Validators.required]]
		});
	}

	login(): void {
		if (this.loginForm.valid) {
			this.userService.login(this.loginForm.value.email, this.loginForm.value.password)
				.subscribe({
					next: (response) => {
						this.userService.setCurrentUser(response);

						if(response.user.role === 'admin') {
							this.router.navigate(['/admin/dashboard']);
						} else {
							this.router.navigate(['/']);
						}
					},
					error: (error) => {
						console.error('Login failed', error);
					}
				});
		}
	}

}

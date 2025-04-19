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

	constructor(private fb: FormBuilder, private userService: UserService) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.minLength(6), Validators.required]]
		});
	}

	simulateLogin() {
		this.userService.setCurrentUser({
			email: 'devfeliperodrigues@gmail.com',
			token: '1234567890'
		});
	}

}

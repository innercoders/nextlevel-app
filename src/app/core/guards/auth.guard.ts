import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { UserService } from "@app/service";
@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(private router: Router, private userService: UserService) {}

	canActivate(): boolean {
		if (this.userService.checkAuth()) {
			return true;
		}

		this.router.navigate(['/login']);
		return false;
	}
}
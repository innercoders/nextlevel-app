import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from '../service/user.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
	const userService = inject(UserService);
	const accessToken = userService.getAccessToken();

	if (accessToken) {
		const authReq = req.clone({
			setHeaders: {
				Authorization: `Bearer ${accessToken}`
			}
		});
		return next(authReq);
	}

	return next(req);
}; 
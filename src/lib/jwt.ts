import { envs } from '@/config';
import jwt, { SignOptions } from 'jsonwebtoken';

export interface JwtPayload {
	user_id: number;
	username: string;
}

export const generateToken = (payload: JwtPayload, expiresIn: string | number = '7d'): string => {
	return jwt.sign(payload, envs.JWT_SECRET, { expiresIn } as SignOptions);
};

export const verifyToken = (token: string): JwtPayload | null => {
	try {
		const decoded = jwt.verify(token, envs.JWT_SECRET) as JwtPayload;
		return decoded;
	} catch (error) {
		console.log({ error });
		return null;
	}
};

export const decodeToken = (token: string): JwtPayload | null => {
	try {
		const decoded = jwt.decode(token) as JwtPayload;
		return decoded;
	} catch (error) {
		console.log({ error });
		return null;
	}
};

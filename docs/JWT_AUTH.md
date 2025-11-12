# Configuración de JWT

## Variables de Entorno

Agrega esta variable a tu archivo `.env`:

```env
JWT_SECRET=tu_clave_secreta_muy_larga_y_segura_aqui
```

**Importante**: Genera una clave secreta segura usando:
```bash
openssl rand -base64 32
```

## Uso de la función `me()`

### En un Server Component o Server Action

```typescript
import { me } from '@/actions';

export default async function ProfilePage() {
  const { success, data: user, message } = await me();
  
  if (!success) {
    return <div>Error: {message}</div>;
  }
  
  return (
    <div>
      <h1>Perfil de Usuario</h1>
      <p>ID: {user?.user_id}</p>
      <p>Usuario: {user?.username}</p>
      <p>Nombre: {user?.persons?.first_name} {user?.persons?.last_name}</p>
      <p>Email: {user?.persons?.email}</p>
      <p>Rol: {user?.roles?.role_name}</p>
      <p>Departamento: {user?.employees?.departments?.department_name}</p>
    </div>
  );
}
```

### En un Server Action

```typescript
'use server';

import { me } from '@/actions';

export async function myServerAction() {
  const { success, data: currentUser } = await me();
  
  if (!success) {
    return { error: 'No autenticado' };
  }
  
  // Hacer algo con el usuario autenticado
  console.log(`Acción ejecutada por: ${currentUser?.username}`);
  
  return { success: true };
}
```

## Cómo funciona

La función `me()` busca el JWT en dos lugares (en orden):

1. **Header Authorization**: `Authorization: Bearer <token>`
2. **Cookie**: Cookie con nombre `token`

El JWT debe contener:
```json
{
  "user_id": 123,
  "username": "usuario123",
  "role_id": 1
}
```

## Generar el JWT

Para generar un JWT cuando un usuario inicia sesión:

```typescript
import { generateToken } from '@/lib';

// En tu función de login
const token = generateToken({
  user_id: user.user_id,
  username: user.username,
  role_id: user.role_id
}, '7d'); // Expira en 7 días

// Opción 1: Enviar en la respuesta para que el cliente lo use en headers
return { token };

// Opción 2: Guardar en cookie (recomendado para SSR)
import { cookies } from 'next/headers';
const cookieStore = await cookies();
cookieStore.set('token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 24 * 7 // 7 días
});
```

## Verificación de Token

La función `me()` automáticamente:
- ✅ Verifica que el token sea válido
- ✅ Verifica que no esté expirado
- ✅ Verifica que el usuario exista en la BD
- ✅ Verifica que el usuario esté activo
- ✅ Devuelve toda la información del usuario con sus relaciones

## Códigos de Error

La función puede retornar estos códigos de error:

- `UNAUTHORIZED`: No se proporcionó token
- `INVALID_TOKEN`: Token inválido o expirado
- `USER_NOT_FOUND`: El usuario del token no existe
- `USER_INACTIVE`: El usuario está inactivo
- `INTERNAL_ERROR`: Error del servidor

## Ejemplo con API Route

Si usas API routes, la función también funciona:

```typescript
// app/api/profile/route.ts
import { me } from '@/actions';
import { NextResponse } from 'next/server';

export async function GET() {
  const { success, data: user, message, code } = await me();
  
  if (!success) {
    return NextResponse.json(
      { error: message },
      { status: code === 401 ? 401 : 500 }
    );
  }
  
  return NextResponse.json({ user });
}
```

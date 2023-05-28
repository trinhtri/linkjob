export interface ChangePasswordDto {
    userId: string;
    currentPassword: string;
    password: string;
    confirmPassword: string;
}

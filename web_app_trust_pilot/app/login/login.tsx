export async function login(formData: FormData) {
    const user = {name: formData.get('username'), password: formData.get('password')}
    console.log(user);
}
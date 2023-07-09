import { User } from "../../entities/User";
import { IMailProvider } from "../../providers/IMailProvider";
import { IUserRepository } from "../../repositories/IUsersRepository";
import { CreateUserRequestDTO } from "./CreateUserDTO";

export class CreateUserUseCase {
	constructor(
		private userRepository: IUserRepository,
		private mailProvider: IMailProvider
	) {}
	async execute(data: CreateUserRequestDTO) {
		const userAlreadyExists = await this.userRepository.findByEmail(
			data.email
		);
		if (userAlreadyExists) {
			throw new Error("User already exists.");
		}

		const user = new User(data);
		await this.userRepository.save(user);
		await this.mailProvider.sendMail({
			to: {
				name: data.name,
				email: data.email,
			},
			from: {
				name: "Equipe do meu app",
				email: "equipe@meuapp.com",
			},
			subject: "Seja bem-vindo à plataforma",
			body: "<p>Você já pode fazer login em nossa plataforma.</p>",
		});
	}
}

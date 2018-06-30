import {Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne, ManyToOne, JoinColumn} from "typeorm";
import { User } from "../user/User";

@Entity()
@Unique(["accessKey"])
export class Principal{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    accessKey: string;

    @Column()
    passwordHash: string;
   
    @OneToOne(type => User)
    @JoinColumn()
    subject: User;
}
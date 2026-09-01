import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Role } from '../../role/entities/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity('users')
export class User {

    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    fullName: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column()
    phone: string;

    @Column(({ select: false }))
    passwordHash: string;

    @Field()
    @Column()
    salary: number;

    @Field(() => Role, { nullable: true })
    @ManyToOne(() => Role, (role) => role.users, { nullable: true })
    role: Role;

    @ManyToOne(() => User, (user) => user.employees,{
          nullable: true,
    })
    manager: User;

    @OneToMany(() => User,(user) => user.manager)
    employees: User[];

    @Field()
    @Column({ default: true })
    isActive: boolean;

    @Field()
    @CreateDateColumn()
    createdAt: Date;

    @Field()
    @UpdateDateColumn()
    updatedAt: Date;
}
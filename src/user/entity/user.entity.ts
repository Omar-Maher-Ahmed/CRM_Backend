import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';


@Entity('users')
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    fullName: string;

    @Column()
    email: string;

    @Column()
    phone: string;

    @Column()
    passwordHash: string;

    @Column()
    salary: number;

    // TODO after create role module
    // @ManyToOne()
    // role: Role;

    @ManyToOne(() => User, (user) => user.employees)
    manager: User;

    @OneToMany(() => User,(user) => user.manager)
    employees: User[];

    @Column()
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
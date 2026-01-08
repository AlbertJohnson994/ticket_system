package org.ufop.web.users.dto;

import lombok.Data;

@Data
public class CreateUserDTO {
    private String userId;
    private String name;
    private String email;
    private String phone;
    private String address;
}
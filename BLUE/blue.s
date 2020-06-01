	.file	"blue.c"
	.intel_syntax noprefix
	.text
	.section	.rodata.str1.8,"aMS",@progbits,1
	.align 8
.LC0:
	.string	"Welcome to BLUE - Binary London Underground Entrance"
	.section	.rodata.str1.1,"aMS",@progbits,1
.LC1:
	.string	"Enter the secret password:"
	.section	.rodata.str1.8
	.align 8
.LC2:
	.string	"SUCCESS! The flag is: changeme_on_prod"
	.section	.rodata.str1.1
.LC3:
	.string	"FAIL"
	.section	.text.startup,"ax",@progbits
	.p2align 4,,15
	.globl	main
	.type	main, @function
main:
.LFB11:
	.cfi_startproc
	push	r13
	.cfi_def_cfa_offset 16
	.cfi_offset 13, -16
	lea	rdi, .LC0[rip]
	push	r12
	.cfi_def_cfa_offset 24
	.cfi_offset 12, -24
	push	rbp
	.cfi_def_cfa_offset 32
	.cfi_offset 6, -32
	push	rbx
	.cfi_def_cfa_offset 40
	.cfi_offset 3, -40
	sub	rsp, 40
	.cfi_def_cfa_offset 80
	call	puts@PLT
	lea	rdi, .LC1[rip]
	mov	r13, rsp
	call	puts@PLT
	mov	rdi, QWORD PTR stdout[rip]
	call	fflush@PLT
	mov	rdx, QWORD PTR stdin[rip]
	mov	esi, 20
	mov	rdi, r13
	call	fgets@PLT
	test	rax, rax
	je	.L2
	mov	rdx, r13
.L3:
	mov	ecx, DWORD PTR [rdx]
	add	rdx, 4
	lea	eax, -16843009[rcx]
	not	ecx
	and	eax, ecx
	and	eax, -2139062144
	je	.L3
	mov	ecx, eax
	shr	ecx, 16
	test	eax, 32896
	cmove	eax, ecx
	lea	rcx, 2[rdx]
	cmove	rdx, rcx
	mov	ebx, eax
	add	bl, al
	sbb	rdx, 3
	sub	rdx, r13
	cmp	rdx, 16
	je	.L35
.L2:
	mov	edi, 2000000
	xor	eax, eax
	call	usleep@PLT
	lea	rdi, .LC3[rip]
	call	puts@PLT
	mov	rdi, QWORD PTR stdout[rip]
	call	fflush@PLT
	mov	eax, 1
.L1:
	add	rsp, 40
	.cfi_remember_state
	.cfi_def_cfa_offset 40
	pop	rbx
	.cfi_def_cfa_offset 32
	pop	rbp
	.cfi_def_cfa_offset 24
	pop	r12
	.cfi_def_cfa_offset 16
	pop	r13
	.cfi_def_cfa_offset 8
	ret
.L35:
	.cfi_restore_state
	cmp	BYTE PTR [rsp], 108
	jne	.L2
	cmp	BYTE PTR 1[rsp], 105
	jne	.L2
	cmp	BYTE PTR 2[rsp], 99
	jne	.L2
	xor	edi, edi
	xor	r10d, r10d
	xor	r8d, r8d
	mov	r11d, 108
	mov	ebp, 108
	xor	r9d, r9d
	mov	r12d, 5010
	mov	ecx, 256
	add	r13, 1
	mov	ebx, 3
	jmp	.L5
.L37:
	bt	r12, rdi
	jnc	.L7
.L8:
	test	sil, 1
	jne	.L9
	add	r10d, ebp
.L9:
	mov	eax, r11d
	cdq
	idiv	ecx
	mov	eax, r9d
	mov	r11d, edx
	cdq
	idiv	ecx
	mov	eax, r8d
	mov	r9d, edx
	cdq
	idiv	ecx
	mov	eax, r10d
	mov	r8d, edx
	cdq
	idiv	ecx
	lea	eax, 1[rsi]
	mov	r10d, edx
	cmp	rdi, 14
	je	.L36
	cdq
	movsx	ebp, BYTE PTR 0[r13+rdi]
	idiv	ebx
	add	r11d, ebp
	sub	edx, 1
	jne	.L6
	add	r9d, ebp
.L6:
	add	rdi, 1
.L5:
	mov	esi, edi
	cmp	rdi, 12
	jbe	.L37
.L7:
	add	r8d, ebp
	jmp	.L8
.L36:
	cmp	r11d, 208
	jne	.L2
	cmp	r9d, 170
	jne	.L2
	cmp	r8d, 179
	jne	.L2
	cmp	edx, 170
	jne	.L2
	lea	rdi, .LC2[rip]
	call	puts@PLT
	mov	rdi, QWORD PTR stdout[rip]
	call	fflush@PLT
	xor	eax, eax
	jmp	.L1
	.cfi_endproc
.LFE11:
	.size	main, .-main
	.ident	"GCC: (Debian 8.3.0-5) 8.3.0"
	.section	.note.GNU-stack,"",@progbits

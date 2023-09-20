use {
    crate::state::*,
    anchor_lang::prelude::*,
    anchor_spl::token::{Mint, Token, TokenAccount},
};

#[derive(Accounts)]
pub struct InitializeSwapPdaCtx<'info> {
    #[account(mut)]
    creator: Signer<'info>,

    taker: AccountInfo<'info>,

    #[account(
        init,
        space = SWAP_SIZE,
        payer = creator,
        seeds = [SWAP_SEED.as_bytes(), taker.key().as_ref()],
        bump
    )]
    swap: Account<'info, Swap>,

    system_program: Program<'info, System>,
}

pub fn initialize_swap_handler(ctx: Context<InitializeSwapPdaCtx>) -> Result<()> {
    let swap = &mut ctx.accounts.swap;
    swap.swap_bump = *ctx.bumps.get("swap").unwrap();
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeEscrowPdaCtx<'info> {
    #[account(mut)]
    creator: Signer<'info>,

    taker: AccountInfo<'info>,

    offered_mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [SWAP_SEED.as_bytes(), taker.key().as_ref()],
        bump = swap.swap_bump,
    )]
    swap: Account<'info, Swap>,

    #[account(
        init,
        payer = creator,
        seeds = [ESCROW_SEED.as_bytes(), taker.key().as_ref()],
        bump,
        token::mint = offered_mint,
        token::authority = swap,
    )]
    escrow: Account<'info, TokenAccount>,

    token_program: Program<'info, Token>,
    system_program: Program<'info, System>,
    rent: Sysvar<'info, Rent>,
}

pub fn initialize_escrow_handler(ctx: Context<InitializeEscrowPdaCtx>) -> Result<()> {
    let swap = &mut ctx.accounts.swap;
    swap.escrow = ctx.accounts.escrow.key().clone();
    swap.escrow_bump = *ctx.bumps.get("escrow").unwrap();
    Ok(())
}
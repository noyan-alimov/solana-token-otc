use {
    crate::{errors::ErrorCode, state::*},
    anchor_lang::prelude::*,
    anchor_spl::token::{Mint, Token, TokenAccount, Transfer},
};

#[derive(Accounts)]
pub struct CreateSwapCtx<'info> {
    #[account(mut)]
    creator: Signer<'info>,

    taker: AccountInfo<'info>,

    #[account(
        mut,
        constraint=creator_ata.mint == offered_mint.key()
    )]
    creator_ata: Account<'info, TokenAccount>,

    offered_mint: Account<'info, Mint>,

    desired_mint: Account<'info, Mint>,

    #[account(
        mut,
        seeds = [SWAP_SEED.as_bytes(), taker.key().as_ref()],
        bump = swap.swap_bump,
        // constraint = swap.taker == taker.key(),
        // constraint = swap.offered_mint == offered_mint.key(),
        constraint = swap.escrow == escrow.key(),
        constraint = swap.state != SwapState::Created as u8 @ ErrorCode::InvalidSwapState,
    )]
    swap: Account<'info, Swap>,

    #[account(
        seeds = [ESCROW_SEED.as_bytes(), taker.key().as_ref()],
        bump = swap.escrow_bump,
    )]
    escrow: Account<'info, TokenAccount>,

    token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<CreateSwapCtx>,
    offered_amount: u64,
    desired_amount: u64
) -> Result<()> {
    let swap = &mut ctx.accounts.swap;
    swap.creator = ctx.accounts.creator.key().clone();
    swap.taker = ctx.accounts.taker.key().clone();
    swap.offered_mint = ctx.accounts.offered_mint.key();
    swap.desired_mint = ctx.accounts.desired_mint.key();
    swap.offered_amount = offered_amount;
    swap.desired_amount = desired_amount;
    swap.state = SwapState::Created as u8;

    let transfer_instruction = Transfer{
        from: ctx.accounts.creator_ata.to_account_info(),
        to: ctx.accounts.escrow.to_account_info(),
        authority: ctx.accounts.creator.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction,
    );

    anchor_spl::token::transfer(cpi_ctx, offered_amount)?;

    Ok(())
}
use {
    crate::{errors::ErrorCode, state::*},
    anchor_lang::prelude::*,
    anchor_spl::token::{Mint, Token, TokenAccount, Transfer},
};

#[derive(Accounts)]
pub struct CancelSwapCtx<'info> {
    #[account(mut)]
    creator: Signer<'info>,

    /// CHECK: needed to get swap and escrow pdas
    taker: AccountInfo<'info>,

    offered_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint=creator_ata_offered.owner == creator.key(),
        constraint=creator_ata_offered.mint == offered_mint.key()
    )]
    creator_ata_offered: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [SWAP_SEED.as_bytes(), taker.key().as_ref()],
        bump = swap.swap_bump,
        constraint = swap.creator == creator.key(),
        constraint = swap.taker == taker.key(),
        constraint = swap.offered_mint == offered_mint.key(),
        constraint = swap.escrow == escrow.key(),
        constraint = swap.state == SwapState::Created as u8 @ ErrorCode::InvalidSwapState,
    )]
    swap: Account<'info, Swap>,

    #[account(
        seeds = [ESCROW_SEED.as_bytes(), taker.key().as_ref()],
        bump = swap.escrow_bump,
        constraint=escrow.owner == swap.key(),
        constraint=escrow.mint == offered_mint.key()
    )]
    escrow: Account<'info, TokenAccount>,

    token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<CancelSwapCtx>
) -> Result<()> {
    let swap = &mut ctx.accounts.swap;
    swap.state = SwapState::Cancelled as u8;

    // transfer from escrow to creator
    let bump_vector = &[swap.swap_bump][..];
    let inner = vec![
        SWAP_SEED.as_bytes(),
        swap.taker.as_ref(),
        bump_vector.as_ref(),
    ];
    let outer = vec![inner.as_slice()];

    let transfer_instruction = Transfer{
        from: ctx.accounts.escrow.to_account_info(),
        to: ctx.accounts.creator_ata_offered.to_account_info(),
        authority: swap.to_account_info(),
    };
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction,
        outer.as_slice()
    );

    anchor_spl::token::transfer(cpi_ctx, swap.offered_amount)?;

    Ok(())
}
use {
    crate::{errors::ErrorCode, state::*},
    anchor_lang::prelude::*,
    anchor_spl::token::{Mint, Token, TokenAccount, Transfer, CloseAccount},
};

#[derive(Accounts)]
pub struct CloseSwapCtx<'info> {
    /// CHECK: creator
    #[account(mut)]
    creator: AccountInfo<'info>,

    #[account(mut)]
    taker: Signer<'info>,

    offered_mint: Account<'info, Mint>,

    desired_mint: Account<'info, Mint>,

    #[account(
        mut,
        constraint=creator_ata_offered.owner == creator.key(),
        constraint=creator_ata_offered.mint == offered_mint.key()
    )]
    creator_ata_offered: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint=creator_ata_desired.owner == creator.key(),
        constraint=creator_ata_desired.mint == desired_mint.key()
    )]
    creator_ata_desired: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint=taker_ata_offered.owner == taker.key(),
        constraint=taker_ata_offered.mint == offered_mint.key()
    )]
    taker_ata_offered: Account<'info, TokenAccount>,

    #[account(
        mut,
        constraint=taker_ata_desired.owner == taker.key(),
        constraint=taker_ata_desired.mint == desired_mint.key()
    )]
    taker_ata_desired: Account<'info, TokenAccount>,

    #[account(
        mut,
        seeds = [SWAP_SEED.as_bytes(), taker.key().as_ref()],
        bump = swap.swap_bump,
        constraint = swap.creator == creator.key(),
        constraint = swap.taker == taker.key(),
        constraint = swap.offered_mint == offered_mint.key(),
        constraint = swap.desired_mint == desired_mint.key(),
        constraint = swap.escrow == escrow.key(),
        constraint = swap.state == SwapState::Created as u8 @ ErrorCode::InvalidSwapState,
    )]
    swap: Account<'info, Swap>,

    #[account(
        mut,
        seeds = [ESCROW_SEED.as_bytes(), taker.key().as_ref()],
        bump = swap.escrow_bump,
        constraint=escrow.owner == swap.key(),
        constraint=escrow.mint == offered_mint.key()
    )]
    escrow: Account<'info, TokenAccount>,

    token_program: Program<'info, Token>,
}

pub fn handler(
    ctx: Context<CloseSwapCtx>
) -> Result<()> {
    let swap = &mut ctx.accounts.swap;
    swap.state = SwapState::Closed as u8;

    // transfer from escrow to taker
    let bump_vector = &[swap.swap_bump][..];
    let inner = vec![
        SWAP_SEED.as_bytes(),
        swap.taker.as_ref(),
        bump_vector.as_ref(),
    ];
    let outer = vec![inner.as_slice()];

    let transfer_instruction = Transfer{
        from: ctx.accounts.escrow.to_account_info(),
        to: ctx.accounts.taker_ata_offered.to_account_info(),
        authority: swap.to_account_info(),
    };
    let cpi_ctx = CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction,
        outer.as_slice()
    );

    anchor_spl::token::transfer(cpi_ctx, swap.offered_amount)?;

    // close escrow
    let should_close = {
        ctx.accounts.escrow.reload()?;
        ctx.accounts.escrow.amount == 0
    };

    if should_close {
        let ca = CloseAccount{
            account: ctx.accounts.escrow.to_account_info(),
            destination: ctx.accounts.creator.to_account_info(),
            authority: swap.to_account_info(),
        };
        let cpi_ctx = CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            ca,
            outer.as_slice(),
        );
        anchor_spl::token::close_account(cpi_ctx)?;
    }

    // transfer from taker to creator
    let transfer_instruction = Transfer{
        from: ctx.accounts.taker_ata_desired.to_account_info(),
        to: ctx.accounts.creator_ata_desired.to_account_info(),
        authority: ctx.accounts.taker.to_account_info(),
    };
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction
    );

    anchor_spl::token::transfer(cpi_ctx, swap.desired_amount)?;

    Ok(())
}
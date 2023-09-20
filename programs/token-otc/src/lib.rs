use {anchor_lang::prelude::*, instructions::*};

pub mod instructions;
pub mod state;
pub mod errors;

declare_id!("BuxnzeA7AXB77qpyg3d4Hk4RE7Qm7AXkfQ7Wh7dedLw4");

#[program]
pub mod token_otc {
    use super::*;

    pub fn initialize_swap(ctx: Context<InitializeSwapPdaCtx>) -> Result<()> {
        initialize_pdas::initialize_swap_handler(ctx)
    }

    pub fn initialize_escrow(ctx: Context<InitializeEscrowPdaCtx>) -> Result<()> {
        initialize_pdas::initialize_escrow_handler(ctx)
    }

    pub fn create_swap(ctx: Context<CreateSwapCtx>, offered_amount: u64, desired_amount: u64) -> Result<()> {
        create_swap::handler(ctx, offered_amount, desired_amount)
    }

    pub fn close_swap(ctx: Context<CloseSwapCtx>) -> Result<()> {
        close_swap::handler(ctx)
    }

    pub fn cancel_swap(ctx: Context<CancelSwapCtx>) -> Result<()> {
        cancel_swap::handler(ctx)
    }
}

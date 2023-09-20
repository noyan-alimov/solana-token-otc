pub mod instructions;
pub mod state;

use {anchor_lang::prelude::*, instructions::*};

declare_id!("BuxnzeA7AXB77qpyg3d4Hk4RE7Qm7AXkfQ7Wh7dedLw4");

#[program]
pub mod token_otc {
    use super::*;

    pub fn initialize_auction(ctx: Context<InitializeSwapPdaCtx>) -> Result<()> {
        initialize_pdas::initialize_swap_handler(ctx)
    }

    pub fn initialize_escrow(ctx: Context<InitializeEscrowPdaCtx>) -> Result<()> {
        initialize_pdas::initialize_escrow_handler(ctx)
    }
}

#[derive(Accounts)]
pub struct Initialize {}

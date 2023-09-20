use anchor_lang::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, AnchorSerialize, AnchorDeserialize)]
#[repr(u8)]
pub enum SwapState {
    Created = 1,
    Closed = 2,
    Cancelled = 3,
}

pub const SWAP_SEED: &str = "swap";
pub const ESCROW_SEED: &str = "escrow";
pub const SWAP_SIZE: usize = 8 + (5 * 32) + (2 * 8) + (3 * 1);

#[account]
pub struct Swap {
    pub creator: Pubkey,
    pub taker: Pubkey,
    pub offered_mint: Pubkey,
    pub desired_mint: Pubkey,
    pub escrow: Pubkey,
    pub offered_amount: u64,
    pub desired_amount: u64,
    pub state: u8,
    pub swap_bump: u8,
    pub escrow_bump: u8,
}
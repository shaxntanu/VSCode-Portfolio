#![no_std]

use core::panic::PanicInfo;

const BORED_AFTER_MS: u32 = 50_000;
const ANGRY_AFTER_MS: u32 = 150_000;
const FACT_INTERVAL_MIN_MS: u32 = 60_000;
const FACT_INTERVAL_MAX_MS: u32 = 120_000;

static mut RNG_STATE: u32 = 0xA341_316C;

#[panic_handler]
fn panic(_info: &PanicInfo<'_>) -> ! {
    loop {}
}

#[no_mangle]
pub extern "C" fn seed_rng(seed: u32) {
    // Xorshift cannot advance from zero, so replace an empty browser seed.
    unsafe {
        RNG_STATE = if seed == 0 { 0xA341_316C } else { seed };
    }
}

fn next_random() -> u32 {
    unsafe {
        let mut value = RNG_STATE;
        value ^= value << 13;
        value ^= value >> 17;
        value ^= value << 5;
        if value == 0 {
            value = 0xA341_316C;
        }
        RNG_STATE = value;
        value
    }
}

/// Return the index of a message, avoiding `previous_index` when possible.
#[no_mangle]
pub extern "C" fn choose_message_index(count: u32, previous_index: i32) -> u32 {
    if count == 0 {
        return 0;
    }

    let previous_is_valid = previous_index >= 0 && (previous_index as u32) < count;
    let can_avoid_previous = count > 1 && previous_is_valid;
    let choice_count = if can_avoid_previous { count - 1 } else { count };
    let mut index = next_random() % choice_count;

    if can_avoid_previous && index >= previous_index as u32 {
        index += 1;
    }

    index
}

/// Return 0 for idle, 1 for bored, and 2 for angry.
#[no_mangle]
pub extern "C" fn mood_from_idle(idle_ms: u32) -> u32 {
    if idle_ms >= ANGRY_AFTER_MS {
        2
    } else if idle_ms >= BORED_AFTER_MS {
        1
    } else {
        0
    }
}

/// Apply message priority rules; return 1 when the candidate may replace the current message.
#[no_mangle]
pub extern "C" fn should_show_message(
    current_priority: i32,
    candidate_priority: i32,
    same_message: u32,
) -> u32 {
    if current_priority < 0 {
        return 1;
    }
    if candidate_priority < current_priority {
        return 0;
    }
    if candidate_priority == current_priority && same_message != 0 {
        return 0;
    }
    1
}

/// Choose the next fact interval; lite mode spaces facts twice as far apart.
#[no_mangle]
pub extern "C" fn next_fact_delay(lite_mode: u32) -> u32 {
    let span = FACT_INTERVAL_MAX_MS - FACT_INTERVAL_MIN_MS + 1;
    let delay = FACT_INTERVAL_MIN_MS + (next_random() % span);
    if lite_mode != 0 {
        delay * 2
    } else {
        delay
    }
}

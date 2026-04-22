<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  AlertTriangle,
  Info,
  RefreshCcw,
  ShieldAlert,
  ShieldCheck,
  Trash2,
} from "lucide-vue-next";
import { useSeo } from "../../../composables/useSeo";
import {
  extractErrorCode,
  idVerificationService,
  type IDVerification,
} from "../../../services/idVerification.service";
import { isApiError } from "../../../lib/http";
import { toast } from "../../../lib/toast";

import DetailsSkeleton from "../../../components/dashboard/shared/idVerification/DetailsSkeleton.vue";
import StatusHero from "../../../components/dashboard/shared/idVerification/StatusHero.vue";
import ExtractedDetails from "../../../components/dashboard/shared/idVerification/ExtractedDetails.vue";
import InfoHintCard from "../../../components/dashboard/shared/idVerification/InfoHintCard.vue";
import UploadForm from "../../../components/dashboard/shared/idVerification/UploadForm.vue";
import TipsPanel from "../../../components/dashboard/shared/idVerification/TipsPanel.vue";
import ReplaceDialog from "../../../components/dashboard/shared/idVerification/ReplaceDialog.vue";

useSeo({ title: "ID verification" });

type ViewState = "loading" | "loaded" | "none" | "fetchError";

const viewState = ref<ViewState>("loading");
const record = ref<IDVerification | null>(null);
const fetchError = ref<string | null>(null);

const isVerified = computed(() => !!record.value?.is_verified);
const isPending = computed(() => !!record.value && !record.value.is_verified);

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

// ── Fetch ───────────────────────────────────────────────────────
async function loadRecord() {
  viewState.value = "loading";
  fetchError.value = null;
  try {
    record.value = await idVerificationService.getMine();
    viewState.value = "loaded";
  } catch (err) {
    if (isApiError(err) && err.status === 404) {
      record.value = null;
      viewState.value = "none";
      return;
    }
    fetchError.value = isApiError(err)
      ? err.formError || "We could not load your verification status."
      : "We could not load your verification status.";
    viewState.value = "fetchError";
  }
}

onMounted(loadRecord);

// ── Submit (scan) ───────────────────────────────────────────────
const submitting = ref(false);
const submitError = ref<string | null>(null);

async function handleSubmit(file: File) {
  if (submitting.value) return;
  submitting.value = true;
  submitError.value = null;
  try {
    record.value = await idVerificationService.submitRwandanId(file);
    viewState.value = "loaded";
    toast.success("Your ID is under review", {
      description: "We'll notify you the moment it's approved.",
    });
  } catch (err) {
    if (isApiError(err)) {
      submitError.value =
        err.formError || "Something went wrong. Please try again.";
      // If the server already has a record, refetch so the UI flips rather
      // than stranding the user on an error banner.
      if (extractErrorCode(err.raw) === "ALREADY_VERIFIED") await loadRecord();
    } else {
      submitError.value = "Something went wrong. Please try again.";
    }
  } finally {
    submitting.value = false;
  }
}

// ── Replace (delete + re-upload) ────────────────────────────────
const replaceOpen = ref(false);
const deleting = ref(false);
const deleteError = ref<string | null>(null);

function openReplace() {
  deleteError.value = null;
  replaceOpen.value = true;
}

function closeReplace() {
  if (deleting.value) return;
  replaceOpen.value = false;
  deleteError.value = null;
}

async function confirmReplace() {
  if (deleting.value) return;
  deleting.value = true;
  deleteError.value = null;
  try {
    await idVerificationService.deleteMine();
    record.value = null;
    viewState.value = "none";
    replaceOpen.value = false;
    toast.info("Photo removed", {
      description: "Upload a new photo to continue verification.",
    });
  } catch (err) {
    if (isApiError(err)) {
      // Race: admin approved between page load and click.
      if (extractErrorCode(err.raw) === "ALREADY_VERIFIED") {
        await loadRecord();
        replaceOpen.value = false;
        return;
      }
      deleteError.value =
        err.formError || "We couldn't delete your record. Please try again.";
    } else {
      deleteError.value = "Something went wrong. Please try again.";
    }
  } finally {
    deleting.value = false;
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page header -->
    <header class="flex items-start gap-4">
      <div
        class="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style="background: linear-gradient(135deg, #031a60, #0b2b8a)"
      >
        <ShieldCheck :size="20" color="white" />
      </div>
      <div class="flex-1 min-w-0">
        <h1 class="text-xl sm:text-2xl font-bold" style="color: #031a60">
          ID verification
        </h1>
        <p class="text-sm mt-1" style="color: #6b7294">
          Confirm your identity so landlords and tenants on LandLord can trust
          your rental history.
        </p>
      </div>
    </header>

    <DetailsSkeleton v-if="viewState === 'loading'" />

    <section
      v-else-if="viewState === 'fetchError'"
      class="rounded-2xl bg-white border p-8 text-center"
      style="border-color: #e8eaf0"
    >
      <div
        class="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
        style="background: rgba(239, 68, 68, 0.1)"
      >
        <AlertTriangle :size="22" color="#b91c1c" />
      </div>
      <h2 class="text-base font-bold mb-1" style="color: #031a60">
        Could not load
      </h2>
      <p class="text-sm mb-5" style="color: #6b7294">
        {{ fetchError }}
      </p>
      <button
        type="button"
        @click="loadRecord"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer"
        style="background: #031a60; color: white"
      >
        <RefreshCcw :size="14" />
        Try again
      </button>
    </section>

    <template v-else-if="viewState === 'loaded' && record">
      <StatusHero
        :variant="isVerified ? 'verified' : 'pending'"
        :date-label="
          formatDate(isVerified ? record.verified_at : record.created_at)
        "
      />

      <ExtractedDetails :record="record" />

      <InfoHintCard v-if="isPending" title="What happens next?" :icon="Info">
        An admin reviews each submission for authenticity and quality. You don't
        need to do anything — we'll notify you the moment your verification is
        approved.
        <template #footer>
          <p class="text-xs" style="color: #6b7294">
            Uploaded the wrong photo? You can replace it while the record is
            still pending.
          </p>
          <button
            type="button"
            @click="openReplace"
            class="inline-flex items-center justify-center gap-2 py-2 px-3.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0"
            style="
              background: white;
              border: 1px solid rgba(239, 68, 68, 0.28);
              color: #b91c1c;
            "
          >
            <Trash2 :size="13" />
            Replace photo
          </button>
        </template>
      </InfoHintCard>

      <InfoHintCard v-else title="Need to change your ID?" :icon="ShieldCheck">
        Verified IDs can't be self-updated. Contact our support team and we'll
        help you replace it.
      </InfoHintCard>
    </template>

    <template v-else-if="viewState === 'none'">
      <UploadForm
        :submitting="submitting"
        :error="submitError"
        @submit="handleSubmit"
      />
      <TipsPanel />
      <InfoHintCard
        title="Don't have a Rwandan National ID?"
        :icon="ShieldAlert"
      >
        Passport verification is on our roadmap. For now, please contact support
        and we'll verify you manually.
      </InfoHintCard>
    </template>

    <ReplaceDialog
      :open="replaceOpen"
      :deleting="deleting"
      :error="deleteError"
      @close="closeReplace"
      @confirm="confirmReplace"
    />
  </div>
</template>

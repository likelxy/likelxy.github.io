<template>
    <div class="progress-wrapper" v-if="totalKB > 0">
        <div class="text">{{ formattedUsed }} / {{ formattedTotal }}</div>
    </div>
</template>
<script>
export default {
    props: {
        used: {
            type: Number,
            required: true,
            validator: value => value >= 0
        },
        total: {
            type: Number,
            required: true,
            validator: value => value >= 0
        }
    },
    computed: {
        totalKB() {
            return this.total / 1024;
        },
        usedKB() {
            return this.used / 1024;
        },
        formattedTotal() {
            return this.formatBytes(this.total);
        },
        formattedUsed() {
            return this.formatBytes(this.used);
        }
    },
    methods: {
        formatBytes(bytes) {
            const units = ['B', 'KB', 'MB', 'GB', 'TB'];
            let size = bytes;
            let unitIndex = 0;
            while (size >= 1024 && unitIndex < units.length - 1) {
                size /= 1024;
                unitIndex++;
            }
            return `${size.toFixed(2)} ${units[unitIndex]}`;
        }
    }
};
</script>
  
<style scoped>
.progress-wrapper {
    display: flex;
    align-items: center;
}

.text {
    margin-left: 10px;
}
</style>
  